import cors from 'cors';  // 🔹 Importar CORS
import express from 'express';
import colorsRoutes from '../routes/colors.Routes.js';
import AddressRoutes from '../routes/Address.Routes.js';
import AddressProfileRoutes from '../routes/AddressProfile.Routes.js';
import companyRoutes from '../routes/company.Routes.js';
import stateOrderRoutes from '../routes/stateOrder.Routes.js';
import ordersRoutes from '../routes/orders.Routes.js';
import stateUserRoutes from '../routes/stateUser.Routes.js';
import BrandRoutes from '../routes/brand.Routes.js';
import moduleRoutes from '../routes/module.Routes.js';
import profileRoutes from '../routes/profile.Routes.js';
import productRoutes from '../routes/products.Routes.js';
import roleRoutes from '../routes/role.Routes.js';
import roleModuleRoutes from '../routes/roleModule.Routes.js';
import sizeRoutes from '../routes/size.Routes.js';
import usersRoutes from '../routes/users.Routes.js';
import userApiRoutes from '../routes/apiUser.routes.js';
import imgRoutes from '../routes/img.Routes.js';
import codigeRoutes from '../routes/codige.Routes.js';
import typeProductRoutes from '../routes/typeProduct.Routes.js';
import typeDocumentRoutes from '../routes/typeDocument.Routes.js';


const app = express();

app.use(cors({
    origin: "*",  
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());


app.use('/api_v1', colorsRoutes);
app.use('/api_v1', AddressRoutes);
app.use('/api_v1', AddressProfileRoutes);
app.use('/api_v1', companyRoutes);
app.use('/api_v1', stateOrderRoutes);
app.use('/api_v1', ordersRoutes);
app.use('/api_v1', stateUserRoutes);
app.use('/api_v1', BrandRoutes);
app.use('/api_v1', moduleRoutes);
app.use('/api_v1', profileRoutes);
app.use('/api_v1', productRoutes);
app.use('/api_v1', roleRoutes);
app.use('/api_v1', roleModuleRoutes);
app.use('/api_v1', sizeRoutes);
app.use('/api_v1', usersRoutes);
app.use('/api_v1', userApiRoutes);
app.use('/api_v1', imgRoutes);
app.use('/api_v1', typeProductRoutes);
app.use('/api_v1', typeDocumentRoutes);
app.use('/api_v1', codigeRoutes);


app.use((rep, res, nex) => {
    res.status(404).json({
        message: 'Endpoint losses'
    });
});

export default app;


