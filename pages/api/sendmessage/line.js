import axios from "axios";
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
    } else {
        const line_id = req.body.line_id;
        const message = req.body.message;
        const reqBody = {
            to: line_id,
            messages: [
                {
                    type: "text",
                    text: message
                }
            ]
        };
        console.log(reqBody);

        const response = await axios({
            method: "POST",
            url: "https://api.line.me/v2/bot/message/push",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.LINE_ACCESS_TOKEN
            },
            data: reqBody
        })

        res.status(200).json(response.data);
    }
}