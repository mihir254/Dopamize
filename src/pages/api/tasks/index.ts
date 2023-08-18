import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Db, ObjectId } from "mongodb";

const getAllTasks = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const allTasks = await db?.collection("Tasks").find({}).toArray();
    res.status(200).json({ message: "Fetched Data Successfully", data: allTasks });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client?.db("Dopamize");
        if (db) {
            if (req.method === 'GET') {
                getAllTasks(db, req, res);
            } else {
                res.status(405).json({ message: 'Method Not Allowed' });
            }
        } else {
            res.status(500).json({ message: 'No connection to the Database' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
