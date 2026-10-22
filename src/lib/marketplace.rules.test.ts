import { strict as assert } from "node:assert";
import { canBuyerMatch, isMatch, type Buyer, type Company } from "./marketplace";

const company: Company = {
  id: "c_test",
  name: "Empresa Test",
  sector: "Retail y comercio minorista",
  location: "Calle 1",
  city: "Madrid",
  postalCode: "28001",
  country: "España",
  linkedin: "",
  googleProfile: "",
  mapsUrl: "",
  financialsUrl: "",
  websiteUrl: "",
  age: "5",
  revenue: "USD 500,000",
  priceAmount: 100000,
  priceCurrency: "USD",
  desc: "Empresa de prueba",
  owner: "seller@example.com",
  ownerName: "Seller",
  ownerPosition: "Dueño",
  ownerPhone: "+34111111111",
  createdAt: 1,
};

function buyer(position: string): Buyer {
  return {
    email: `${position.toLowerCase().replace(/[^a-z0-9]+/g, "-")}@example.com`,
    phone: "+34222222222",
    name: position,
    sectors: "Retail y comercio minorista",
    budgetMin: "50000",
    budgetMax: "200000",
    currency: "USD",
    locationPref: "Madrid",
    country: "España",
    linkedin: "",
    position,
    thesis: "Busca comprar una empresa retail",
    role: "buyer",
    updatedAt: 1,
  };
}

assert.equal(canBuyerMatch("Dueño / Empresario"), true);
assert.equal(canBuyerMatch("Inversor particular"), true);
assert.equal(canBuyerMatch("Family office"), false);
assert.equal(canBuyerMatch("Fondo de inversión"), false);
assert.equal(canBuyerMatch("Banco de inversión"), false);
assert.equal(canBuyerMatch("Broker / Consultor M&A"), false);
assert.equal(canBuyerMatch("CFO / Consultor Financiero"), false);

assert.equal(isMatch(company, buyer("Dueño / Empresario")), true);
assert.equal(isMatch(company, buyer("Inversor particular")), true);
assert.equal(isMatch(company, buyer("Family office")), false);
assert.equal(isMatch(company, buyer("Fondo de inversión")), false);
assert.equal(isMatch(company, buyer("Banco de inversión")), false);
assert.equal(isMatch(company, buyer("Broker / Consultor M&A")), false);
assert.equal(isMatch(company, buyer("CFO / Consultor Financiero")), false);


assert.equal(isMatch(company, { ...buyer("Dueño / Empresario"), country: "México" }), false);
assert.equal(isMatch(company, { ...buyer("Dueño / Empresario"), country: "España" }), true);

// Ciudad: tiene que coincidir cuando ambos la indicaron.
assert.equal(isMatch(company, { ...buyer("Dueño / Empresario"), locationPref: "Barcelona" }), false);
assert.equal(isMatch(company, { ...buyer("Dueño / Empresario"), locationPref: "Madrid, Chamberí" }), true);
assert.equal(isMatch(company, { ...buyer("Dueño / Empresario"), locationPref: "" }), true);
assert.equal(isMatch(company, { ...buyer("Dueño / Empresario") }), true);
const companySinCiudad = { ...company, city: "" };
assert.equal(isMatch(companySinCiudad, buyer("Dueño / Empresario")), true);
// País correcto pero ciudad de otro país: el país bloquea primero.
assert.equal(isMatch(company, { ...buyer("Dueño / Empresario"), country: "México", locationPref: "Madrid" }), false);
