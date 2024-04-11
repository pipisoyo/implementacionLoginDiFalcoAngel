import { Router } from "express";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/users.js";
import CartsManager from "../dao/services/cartManager.js";

const sessionsRouter = Router();
const cartsManager = new CartsManager();

sessionsRouter.post("/register", async (req, res) => {

  const { first_name, last_name, email, age, password } = req.body;
  const exist = await userModel.findOne({ email: email });
  const cart = await cartsManager.createCart()

  if (exist || email === "adminCoder@coder.com") {
    
    return res.status(400).send({ error: "error", message: "El usuario ya esta registrado" })
  }

  const user = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    cart
  };

  const result = await userModel.create(user)
  res.status(201).send({ status: "succes", payload: result })
});


sessionsRouter.post("/login", async (req, res) => {

  const { email, password } = req.body;
  let user = await userModel.findOne({ email });

  if ((email === 'adminCoder@coder.com' && password === 'adminCod3r123') && (!user)) {
    user = {
      first_name: "Administrador",
      last_name: "",
      age: "",
      role: "admin"
    }
  } else if (!user) {
    return res.status(400).send({ status: "error", error: "Error en las credenciales" });
  } else {

    const validarPass = isValidPassword(user, password);
    console.log(validarPass);
    if (!validarPass)
      return res
        .status(401)
        .send({ error: "error", message: "Error de credenciales" });
  }

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role || 'user',
    cartId: user.cart
  };

  res.send({
    status: "success",
    payload: req.session.user,
    message: "Inicio exitoso",
  });
});

sessionsRouter.post('/logout', (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.sendStatus(200);
  });
});

export default sessionsRouter;