import cors from 'cors';  // 🔹 Importar CORS
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';    
import cookieParser from 'cookie-parser';
import { guardView, allowVisitors } from '../middlewares/viewAccess.js';
import colorsRoutes from '../routes/colors.Routes.js';
import addressRoutes from '../routes/Address.Routes.js';
import addressProfileRoutes from '../routes/AddressProfile.Routes.js';
import companyRoutes from '../routes/company.Routes.js';
import stateOrderRoutes from '../routes/stateOrder.Routes.js';
import ordersRoutes from '../routes/orders.Routes.js';
import stateUserRoutes from '../routes/stateUser.Routes.js';
import brandRoutes from '../routes/brand.Routes.js';
import moduleRoutes from '../routes/module.Routes.js';
import profileRoutes from '../routes/profile.Routes.js';
import productRoutes from '../routes/products.Routes.js';
import roleRoutes from '../routes/role.Routes.js';
import roleModuleRoutes from '../routes/roleModule.Routes.js';
import sizeRoutes from '../routes/size.Routes.js';
import usersRoutes from '../routes/users.Routes.js';
import userApiRoutes from '../routes/apiUser.Routes.js';
import imgRoutes from '../routes/img.Routes.js';
import codigeRoutes from '../routes/codige.Routes.js';
import typeProductRoutes from '../routes/typeProduct.Routes.js';
import typeDocumentRoutes from '../routes/typeDocument.Routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../public');
const app = express();

app.use(express.static(publicPath));


app.use(cors());

app.use(express.json());
app.use(cookieParser());


app.use('/api_v1', colorsRoutes);
app.use('/api_v1', addressRoutes);
app.use('/api_v1', addressProfileRoutes);
app.use('/api_v1', companyRoutes);
app.use('/api_v1', stateOrderRoutes);
app.use('/api_v1', ordersRoutes);
app.use('/api_v1', stateUserRoutes);
app.use('/api_v1', brandRoutes);
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

// ...existing code...

// ==== PROTECCIÓN DASHBOARD: Empresas y Administradores ====
const onlyCompanyAndAdmin = guardView(['Empresa','Admin']);

app.get('/dashboard/address', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/address/address.html'));
});
app.get('/dashboard/addressProfile', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/addressProfile/addressProfile.html'));
});
app.get('/dashboard/brand', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/brand/brand.html'));
});
app.get('/dashboard/codige', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/codige/codige.html'));
});
app.get('/dashboard/colors', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/colors/colors.html'));
});
app.get('/dashboard/company', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/company/company.html'));
});
app.get('/dashboard/dashboard', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/dashboard/dashboard.html'));
});
app.get('/dashboard/img', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/img/img.html'));
});
app.get('/dashboard/module', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/module/module.html'));
});
app.get('/dashboard/orders', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/orders/orders.html'));
});
app.get('/dashboard/product', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/product/product.html'));
});
app.get('/dashboard/profile', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/profile/profile.html'));
});
app.get('/dashboard/role', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/role/role.html'));
});
app.get('/dashboard/roleModule', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/roleModule/roleModule.html'));
});
app.get('/dashboard/size', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/size/size.html'));
});
app.get('/dashboard/stateOrder', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/stateOrder/stateOrder.html'));
});
app.get('/dashboard/stateUser', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/stateUser/stateUser.html'));
});
app.get('/dashboard/typeDocument', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/typeDocument/typeDocument.html'));
});
app.get('/dashboard/typeProduct', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/typeProduct/typeProduct.html'));
});
app.get('/dashboard/users', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/users/users.html'));
});
app.get('/dashboard/apiUser', onlyCompanyAndAdmin, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/dashboard/apiUser/apiUser.html'));
});


// ==== VISTAS PÚBLICAS: Visitantes/Clientes/Empresa/Admin ====
const publicView = allowVisitors();

app.get('/generalViews/BlogModas', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/BlogModas/Blog_modas.html'));
});
app.get('/generalViews/camisaAlfilerada', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/camisaAlfilerada/camisaAlfilereada.html'));
});
app.get('/generalViews/camisaAmericana', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/camisaAmericana/camisaAmericana.html'));
});
app.get('/generalViews/camisaPasador', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/camisaPasador/camisaPasador.html'));
});
app.get('/generalViews/camisas', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/camisas/camisas.html'));
});
// Carrito y perfil requieren al menos 'Cliente'
const onlyClientAndUp = guardView(['Cliente','Empresa','Admin']);
app.get('/generalViews/carritoCompras', onlyClientAndUp, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/carritoCompras/carritoCompras.html'));
});
app.get('/generalViews/elegant', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/elegant/elegant.html'));
});
app.get('/generalViews/home', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/home/home.html'));
});
app.get('/generalViews/logeado', onlyClientAndUp, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/logeado/logeado.html'));
});
app.get('/generalViews/login', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/login/login.html'));
});
app.get('/generalViews/master', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/master/master.html'));
});
app.get('/generalViews/pantalonDrill', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/pantalonDrill/PantalonDrill.html'));
});
app.get('/generalViews/pantalones', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/pantalones/pantalones.html'));
});
app.get('/generalViews/pantalonGabardina', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/pantalonGabardina/pantalonGabardina.html'));
});
app.get('/generalViews/pantalonLino', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/pantalonLino/PantalonLino.html'));
});
app.get('/generalViews/pasarela', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/pasarela/pasarela.html'));
});
app.get('/generalViews/profile', onlyClientAndUp, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/profile/profile.html'));
});
app.get('/generalViews/codige', onlyClientAndUp, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/codige/codige.html'));
});
app.get('/generalViews/register', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/register/register.html'));
});
app.get('/generalViews/shoptop', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/shoptop/shoptop.html'));
});
app.get('/generalViews/torsoAbrigoFormal', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/torsoAbrigoFormal/abrigoFormal.html'));
});
app.get('/generalViews/torsoBlazer', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/torsoBlazer/blazer.html'));
});
app.get('/generalViews/torsoGaban', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/torsoGaban/gaban.html'));
});
app.get('/generalViews/torso', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/torso/torso.html'));
});
app.get('/generalViews/userLoged', onlyClientAndUp, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/userLoged/userLogued.html'));
});
app.get('/generalViews/Visitor', publicView, (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/Visitor/Visitor.html'));
});

// ...existing code...

app.get('/views/dashboard/:section/:file', (req, res) => {
    const section = req.params.section;
    if (section === 'address') return res.redirect('/dashboard/address');
    if (section === 'addressProfile') return res.redirect('/dashboard/addressProfile');
    if (section === 'brand') return res.redirect('/dashboard/brand');
    if (section === 'codige') return res.redirect('/dashboard/codige');
    if (section === 'colors') return res.redirect('/dashboard/colors');
    if (section === 'company') return res.redirect('/dashboard/company');
    if (section === 'dashboard') return res.redirect('/dashboard/dashboard');
    if (section === 'img') return res.redirect('/dashboard/img');
    if (section === 'module') return res.redirect('/dashboard/module');
    if (section === 'orders') return res.redirect('/dashboard/orders');
    if (section === 'product') return res.redirect('/dashboard/product');
    if (section === 'profile') return res.redirect('/dashboard/profile');
    if (section === 'role') return res.redirect('/dashboard/role');
    if (section === 'roleModule') return res.redirect('/dashboard/roleModule');
    if (section === 'size') return res.redirect('/dashboard/size');
    if (section === 'stateOrder') return res.redirect('/dashboard/stateOrder');
    if (section === 'stateUser') return res.redirect('/dashboard/stateUser');
    if (section === 'typeDocument') return res.redirect('/dashboard/typeDocument');
    if (section === 'typeProduct') return res.redirect('/dashboard/typeProduct');
    if (section === 'users') return res.redirect('/dashboard/users');
    if (section === 'apiUser') return res.redirect('/dashboard/apiUser');
    
    res.status(404).send('Not found');
});

app.get('/views/generalViews/:section/:file', (req, res) => {
    const section = req.params.section;
    if (section === 'BlogModas') return res.redirect('/generalViews/BlogModas');
    if (section === 'camisaAlfilerada') return res.redirect('/generalViews/camisaAlfilerada');
    if (section === 'camisaAmericana') return res.redirect('/generalViews/camisaAmericana');
    if (section === 'camisaPasador') return res.redirect('/generalViews/camisaPasador');
    if (section === 'camisas') return res.redirect('/generalViews/camisas');
    if (section === 'carritoCompras') return res.redirect('/generalViews/carritoCompras');
    if (section === 'elegant') return res.redirect('/generalViews/elegant');
    if (section === 'home') return res.redirect('/generalViews/home');
    if (section === 'logeado') return res.redirect('/generalViews/logeado');
    if (section === 'login') return res.redirect('/generalViews/login');
    if (section === 'master') return res.redirect('/generalViews/master');
    if (section === 'pantalonDrill') return res.redirect('/generalViews/pantalonDrill');
    if (section === 'pantalonGabardina') return res.redirect('/generalViews/pantalonGabardina');
    if (section === 'pantalonLino') return res.redirect('/generalViews/pantalonLino');
    if (section === 'pantalones') return res.redirect('/generalViews/pantalones');
    if (section === 'pasarela') return res.redirect('/generalViews/pasarela');
    if (section === 'profile') return res.redirect('/generalViews/profile');
    if (section === 'register') return res.redirect('/generalViews/register');
    if (section === 'shoptop') return res.redirect('/generalViews/shoptop');
    if (section === 'torsoAbrigoFormal') return res.redirect('/generalViews/torsoAbrigoFormal');
    if (section === 'torsoBlazer') return res.redirect('/generalViews/torsoBlazer');
    if (section === 'torsoGaban') return res.redirect('/generalViews/torsoGaban');
    if (section === 'torso') return res.redirect('/generalViews/torso');
    if (section === 'userLoged') return res.redirect('/generalViews/userLoged');
    if (section === 'Visitor') return res.redirect('/generalViews/Visitor');

    res.status(404).send('Not found');
});

// Compatibilidad: enlaces antiguos tipo /views/{section}/{file}.html -> redirigir a /generalViews/{section}
app.get('/views/:section/:file', (req, res) => {
    const section = req.params.section;
    // Evitar interferir con rutas específicas ya definidas (dashboard/generalViews) colocando esta ruta después de ellas
    return res.redirect(`/generalViews/${section}`);
});



// Ruta raíz -> Home
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'views/generalViews/home/home.html'));
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
});

export default app;


