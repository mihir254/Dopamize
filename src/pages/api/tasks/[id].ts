import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Db, ObjectId } from "mongodb";

const updateTask = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const objectID = new ObjectId(id as string);
    const { task, completed } = JSON.parse(req.body);
    const updateResult = await db?.collection("Tasks").updateOne(
        { _id: objectID },
        { $set: { task, completed } }
    );
    if (updateResult.acknowledged) {
        res.status(200).json({ message: "The task has been updated successfully" });
    } else {
        res.status(404).json({ message: "Task not found", data: {objectID, task, completed} });
    }
}

const deleteTask = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const objectID = new ObjectId(id as string);
    const deleteResult = await db?.collection("Tasks").deleteOne({ _id: objectID });
    if (deleteResult.deletedCount === 1) {
        res.status(200).json({ message: "Task deleted succesfully" });
    } else {
        res.status(404).json({ message: "Task not found" });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client?.db("Dopamize");
        if (db) {
            if (req.method === 'PUT') {
                updateTask(db, req, res);
            } else if (req.method === 'DELETE') {
                deleteTask(db, req, res);
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
