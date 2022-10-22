import { TodoItemCreateRequest } from './../share-types/request/index';
import axios from 'axios';
import express from "express";
import { TodoItem } from '../share-types/modules/todoItem';
import cors from 'cors';
import bodyParser from 'body-parser'
import { v4 as uuidv4 } from 'uuid';
import url from 'url';

const app = express();

declare namespace Express {
  export interface Request {
    status: boolean
  }
}


app.use(cors())

axios.defaults.baseURL = 'http://localhost:5050';

const port = 3001;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// LIST
app.get('/todo/list', async (req, res) => {
  try {
    const value = await axios.get("todos");

    if (typeof req.query.status !== 'undefined') {
      const status = req.query.status === 'true'

      if (value.status) {
        const v = value.data as TodoItem[];
        res.json(v.filter(i => i.status == status))
      }
    }
    else {
      res.json(value.data)
    }
  }
  catch (err: any) {
    res.json({
      error: err.message
    })
  }
  // res.send("nah")
})

// ADD
app.post("/todo", async (req, res) => {
  const newItem = req.body as TodoItemCreateRequest;

  try {
    const value = await axios.post("todos", { id: uuidv4(), ...newItem });

    if (value.status) {
      res.json(value.data);
    }
    else {
      res.json(value.data);
    }
  }
  catch (err: any) {
    res.send(err.message)
  }
})

//UPDATE
app.patch("/todo/:id", async (req, res) => {
  const newItem = req.body as TodoItem;
  const id = req.params.id;

  try {
    const value = await axios.patch("todos/" + id, newItem);

    if (value.status) {
      res.json(value.data);
    }
    else {
      res.json(value.data);
    }
  }
  catch (err: any) {
    res.send(err.message)
  }
})

//DELETE
app.delete("/todo/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const value = await axios.delete("todos/" + id);

    if (value.status) {
      res.json(value.data);
    }
    else {
      res.json(value.data);
    }
  }
  catch (err: any) {
    res.send(err.message)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})