module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Allows you to interact with Chat GPT-3 from OpenAI"),
  async execute(interaction) {
    const axios = require("axios");

    async function getResponse() {
      try {
        const apiKey = "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";

        const prompt = interaction;

        // Envoie la requête à l'API
        const response = await axios({
          method: "post",
          url: "https://api.openai.com/v1/chat",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          data: {
            model: "chat",
            prompt: prompt,
          },
        });

        // Affiche la réponse de l'API
        console.log(response.data.response);
      } catch (error) {
        console.error(error);
      }
    }

    const answer = getResponse();

    await interaction.reply(answer);
  },
};
