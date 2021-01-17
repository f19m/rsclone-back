const secret = process.env.NODE_ENV === 'production' ? process.env.SECRET || 'MySuP3R_z3kr3t' : 'MySuP3R_z3kr3t';
const port = process.env.PORT || 80;
const expiration = '6h';
const server = '';
export default { secret, port, expiration };
