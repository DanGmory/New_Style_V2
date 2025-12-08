import jwt from 'jsonwebtoken';

function parseCookie(req, name){
  const raw = req.headers?.cookie || '';
  const parts = raw.split(';').map(s => s.trim());
  const found = parts.find(p => p.startsWith(name + '='));
  if(!found) return null;
  const val = found.substring(name.length + 1);
  try { return decodeURIComponent(val); } catch { return val; }
}

function getTokenFromReq(req){
  // Prioridad cookie 'token'; fallback Authorization: Bearer
  const c = parseCookie(req, 'token');
  if (c) return c;
  const h = req.headers?.authorization || req.header?.('Authorization');
  if (!h) return null;
  return h.replace(/^Bearer\s+/i, '').trim();
}

export function guardView(allowedRoles){
  // allowedRoles: array de Role_name permitidos, p.ej. ['Cliente','Empresa','Admin']
  return (req, res, next) => {
    try {
      const token = getTokenFromReq(req);
      if(!token){
        // Sin token = visitante
        return deny(res);
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const roleName = payload?.Role_name || payload?.role || null;
      if(!roleName){ return deny(res); }
      const norm = (s) => String(s || '').toLowerCase().trim();
      const allowed = (allowedRoles || []).map(norm);
      const userRole = norm(roleName);
      if (allowed.includes('*') || allowed.includes(userRole)) return next();
      return deny(res);
    } catch (e){
      return deny(res);
    }
  };
}

export function allowVisitors(){
  // Middleware no-op para rutas públicas
  return (_req, _res, next) => next();
}

function deny(res){
  // Redirige a login por defecto
  return res.redirect('/generalViews/login');
}
