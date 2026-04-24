import OpenAI from "openai";
import readline from "node:readline";
import fs from "node:fs";

const client = new OpenAI();

const ohje = `
Olet verkkokurssin oppimisen tukija.

Tehtäväsi on auttaa oppijaa ohjelmien käytössä vastaamalla kurssin sisältöön liittyviin kysymyksiin.

Toimi näin:
- Vastaa selkeällä ja yksinkertaisella suomella
- Pidä vastaukset melko lyhyinä
- Anna ohjeet vaihe vaiheelta
- Käytä numeroituja listoja, kun annat ohjeita

Jos vastaus löytyy kurssin materiaalista:
- Vastaa kysymykseen
- Kerro lopuksi, mistä aiheesta tai videosta ohje löytyy

Jos vastausta ei löydy kurssin materiaalista:
- Kerro, ettet löydä vastausta tästä kurssista
- Älä keksi tietoa

Tärkeää:
- Älä vastaa kysymyksiin, jotka eivät liity kurssin sisältöön
- Älä laajenna muihin ohjelmiin tai yleisiin ohjeisiin
`;

const tiedostot = fs.readdirSync("kurssit");

let kurssisisalto = "";

for (const tiedosto of tiedostot) {
  const sisalto = fs.readFileSync(`kurssit/${tiedosto}`, "utf8");
  kurssisisalto += "\n\n" + sisalto;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Kirjoita kysymys: ", async (kysymys) => {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: ohje
        },
        {
          role: "user",
          content: `Kurssin sisältö:\n${kurssisisalto}\n\nKysymys:\n${kysymys}`
        }
      ]
    });

    console.log("\nAI:n vastaus:\n");
    console.log(response.output_text);
  } catch (error) {
    console.error("\nVirhe:\n", error.message);
  } finally {
    rl.close();
  }
});