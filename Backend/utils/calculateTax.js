const taxSlabs = require('./taxSlab');

function calculateTax(income, country = 'INDIA') {
  let tax = 0;
  let previousLimit = 0;

  const slabs = taxSlabs[country];
  if (!slabs) throw new Error('Invalid country');

  for (const slab of slabs) {
    const taxable = Math.min(income, slab.upTo) - previousLimit;
    if (taxable > 0) {
      tax += taxable * slab.rate;
      previousLimit = slab.upTo;
    }
  }

  return tax;
}

module.exports = calculateTax;
