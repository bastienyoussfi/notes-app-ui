import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const PORT = 5000;

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();

    res.json(notes);
});

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send("Title and content are required");
    }

    try {
        const note = await prisma.note.create({
            data: {
                title,
                content
            }
        });

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while creating the note" });
    }
});

app.put("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).send("Invalid note id");
    }

    if (!title || !content) {
        return res.status(400).send("Title and content are required");
    }

    try {
        const note = await prisma.note.update({
            where: {
                id: id
            },
            data: {
                title,
                content
            }
        });

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while updating the note" });
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res.status(400).send("Invalid note id");
    }

    try {
        await prisma.note.delete({
            where: {
                id: id
            }
        });

        res.send("Note deleted successfully");
    } catch (error) {
        res.status(500).send("An error occurred while deleting the note");
    }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});