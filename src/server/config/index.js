const secret = process.env.NODE_ENV === 'production' ? process.env.SECRET || 'MySuP3R_z3kr3t' : 'MySuP3R_z3kr3t';
const port = process.env.PORT || 80;
export default { secret, port };
