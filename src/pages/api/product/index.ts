import path from "path";
import fs from "fs/promises";
import {NextApiRequest, NextApiResponse} from "next";
import {mongooseConnect} from "@/lib/mongoose";
import Product from "@/models/Product";
import {v4 as uuidv4} from 'uuid';
import multiparty from "multiparty";
import fsPromises from "fs/promises";

export async function parseForm(req: any) {
    return new Promise<{
        fields: { [key: string]: string[] },
        files: { [key: string]: multiparty.File[] }
    }>((resolve, reject) => {
        const form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
            } else {
                resolve({fields, files});
            }
        });
    });
}

function formData(fields: { [key: string]: string[] }): { [key: string]: string } {
    const formattedFields: { [key: string]: string } = {};
    for (const key in fields) {
        if (fields[key].length > 0) {
            formattedFields [key] = fields[key][0];
        }
    }
    return formattedFields
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const uploadsFolder = 'uploads/';
    if (req.method === "POST") {
        await mongooseConnect();
        try {
            const {fields, files} = await parseForm(req);

            const uploadedFileNames: string[] = [];

            const folderPath = path.join(process.cwd(), `public/${uploadsFolder}`);
            await fs.mkdir(folderPath, {recursive: true});

            for (const key in files) {
                const filesArray = files[key];
                for (const file of filesArray) {
                    const buffer = await fs.readFile(file.path);
                    const filename = uuidv4() + path.extname(file.originalFilename);
                    const filePath = path.join(folderPath, filename);
                    await fs.writeFile(filePath, buffer);
                    uploadedFileNames.push(uploadsFolder + filename);
                }
            }


            const {name,price, description,discount} = formData(fields);
            const productDoc = await Product.create({name,price, description,discount,  images: uploadedFileNames});
            return res.status(201).json({Message: 'Create successfully ', productDoc});
        } catch (error) {
            console.log("Error occurred: ", error);
            return res.status(500).json({Message: "Failed"});
        }
    }else if (req.method === "GET") {
        await mongooseConnect();
        try {
            const id = req.query?.id as string; // Получите строку с одним id
            const idsString = req.query?.ids as string; // Получите строку с ids

            if (id && idsString) {
                // Если указаны и id, и ids, выполните поиск по id и ids
                const productDoc = await Product.findById(id);
                const idsArray = idsString.split(',');
                const productsDoc = await Product.find({ _id: { $in: idsArray } });
                return res.status(200).json({ product: productDoc, products: productsDoc });
            } else if (id) {
                // Если указан только id, выполните поиск по id
                const productDoc = await Product.findById(id);
                if (productDoc) {
                    return res.status(200).json( productDoc);
                } else {
                    return res.status(404).json({ Message: "Product not found" });
                }
            } else if (idsString) {
                // Если указаны только ids, выполните поиск по ids
                const idsArray = idsString.split(',');
                const productsDoc = await Product.find({ _id: { $in: idsArray } });
                return res.status(200).json(productsDoc );
            } else {
                // Если ни id, ни ids не указаны, верните все продукты
                const productsDoc = await Product.find();
                return res.status(200).json(productsDoc);
            }
        } catch (error) {
            console.log("Error occurred: ", error);
            return res.status(500).json({ Message: "Failed" });
        }
    }
        else if (req.method === "DELETE") {
        const id = req.query.id
        try {
            const productDoc = await Product.findById(id);

            if (!productDoc) {
                return res.status(404).json({Message: "IProduct not found"});
            }

            const folderPath = path.join(process.cwd(), `public/`);
            const imageNames = productDoc.images;

            for (const imageName of imageNames) {
                const imagePath = path.join(folderPath, imageName);
                try {
                    await fsPromises.access(imagePath);
                    await fsPromises.unlink(imagePath);
                } catch (error) {
                    console.error("Error deleting image:", error);
                }
            }

            // Удаление продукта
            const deletedProductDoc = await Product.deleteOne({_id: id});
            return res.json(true);
        } catch (error) {
            console.log("Error occurred: ", error);
            return res.status(500).json({Message: "Failed"});
        }
    } else if (req.method === "PUT") {
        await mongooseConnect();
        try {
            const {fields, files} = await parseForm(req);
            const id = req.query.id;

            const folderPath = path.join(process.cwd(), `public/`);

            const productDoc = await Product.findById(id);

            if (!productDoc) {
                return res.status(404).json({Message: "IProduct not found"});
            }
            const oldImageNames = productDoc.images;

            const newImageNames: string[] = [];

            // Save new images and collect their names
            for (const key in files) {
                const filesArray = files[key];
                for (const file of filesArray) {
                    const buffer = await fs.readFile(file.path);
                    const filename = uuidv4() + path.extname(file.originalFilename);
                    const filePath = path.join(folderPath,uploadsFolder, filename);
                    await fs.writeFile(filePath, buffer);
                    newImageNames.push(filename);
                }
            }

            for (const oldImageName of oldImageNames) {
                const oldImagePath = path.join(folderPath, oldImageName); // Обратите внимание на изменение в этой строке
                try {
                    await fsPromises.access(oldImagePath);
                    await fsPromises.unlink(oldImagePath);
                } catch (error) {
                    console.error("Error deleting file:", error);
                }
            }

            // Update other fields
            const {name, description, price} = formData(fields);
            productDoc.set({
                name: name,
                description: description,
                price: parseFloat(price), // Parse the price as a float
                images: newImageNames.map(newImageName =>
                    `${uploadsFolder}${newImageName}`
                ),
            });

            // Update the productDoc
            await productDoc.save();

            return res.status(200).json({Message: "Updated successfully", productDoc});
        } catch (error) {
            console.log("Error occurred: ", error);
            return res.status(500).json({Message: "Failed"});
        }
    } else {
        return res.status(405).json({error: "Method not allowed."});
    }
};

export const config = {
    api: {
        bodyParser: false,
        sizeLimit: "10mb",
    },
};
