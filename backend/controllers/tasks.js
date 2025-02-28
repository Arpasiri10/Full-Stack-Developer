const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();

// Create a new task
const createTasks = async (req, res) => {
    const { title, description, status, due_date, created_at } = req.body;
    try {
        const task = await prisma.tasks.create({
            data: {
                title,
                description,
                status,
                due_date: due_date ? new Date(due_date) : null,
                created_at: created_at ? new Date(created_at) : new Date()
            }
        });

        res.status(201).json({ status: "success", data: task });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create task", error: error.message });
    }
};

// Get all tasks
const getTasks = async (req, res) => {
    const custs = await prisma.tasks.findMany();
    res.json(custs);
};

// Delete a task
const deleteTask = async (req, res) => {
    const id = req.params.id;
    try {
        const existingTask = await prisma.tasks.findUnique({
            where: {
                task_id: Number(id),
            },
        });
        if (!existingTask) {
            return res.status(404).json({ message: `Task not found` });
        }
        await prisma.tasks.delete({
            where: {
                task_id: Number(id),
            },
        });
        res.status(200).json({
            status: "ok",
            message: `Task with ID = ${id} is deleted`,
        });
    } catch (err) {
        console.error('Delete task error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get task by ID
const getTask = async (req, res) => {
    const id = req.params.id;
    try {
        const cust = await prisma.tasks.findUnique({
            where: {
                task_id: Number(id),
            },
        });
        if (!cust) {
            return res.status(404).json({ message: `Task not found` });
        } else {
            res.status(200).json(cust);
        }
    } catch (err) {
        console.error('Get task error:', err);
        res.status(500).json(err);
    }
};

// Update a task by ID
const updateTask = async (req, res) => {
    const { title, description, status, due_date, created_at } = req.body;
    const { id } = req.params;

    const data = {};
    if (title) data.title = title;
    if (description) data.description = description;
    if (status) data.status = status;
    if (due_date) data.due_date = due_date;
    if (created_at) data.created_at = created_at;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'No data provided to update'
        });
    }

    try {
        const cust = await prisma.tasks.update({
            data,
            where: {
                task_id: Number(id),
            },
        });
        res.status(200).json({
            status: 'ok',
            message: `Task with ID = ${id} is updated successfully`,
            task: cust
        });
    } catch (err) {
        if (err.code === 'P2002') {
            res.status(400).json({
                status: 'error',
                message: 'Duplicate data error.'
            });
        } else if (err.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Task with ID = ${id} not found.`
            });
        } else {
            console.error('Update task error:', err);
            res.status(500).json({
                status: 'error',
                message: 'Failed to update task',
            });
        }
    }
};

module.exports = {
    createTasks, getTask, deleteTask, getTasks, updateTask
};
