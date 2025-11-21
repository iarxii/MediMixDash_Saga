import medOne from "../assets/meds/medOne.png";
import medTwo from "../assets/meds/medTwo.png";
import medThree from "../assets/meds/medThree.png";
import medFour from "../assets/meds/medFour.png";
import medFive from "../assets/meds/medFive.png";
import medSix from "../assets/meds/medSix.png";
import medSeven from "../assets/meds/medSeven.png";

export const medications = [
  "Capsulon",
  "Tablix",
  "Syrupix",
  "Pillora",
  "Injecta",
  "Gelux",
  "VitaDose"
];

export const medImages: { [key: string]: string } = {
  Capsulon: medOne,
  Tablix: medTwo,
  Syrupix: medSeven,
  Pillora: medFour,
  Injecta: medSix,
  Gelux: medFive,
  VitaDose: medThree,
};
