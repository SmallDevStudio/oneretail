import connetMongoDB from "@/lib/services/database/mongodb";
import Coins from "@/database/models/Coins";
import Users from "@/database/models/users";

export const config = {
  api: {
    responseLimit: false,
  },
};


export default async function handler(req, res) {
    await connetMongoDB();
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
      }

    if (req.method === "GET") {
        try {
            const coins = await Coins.find({ userId });
        
            const totalEarn = coins
              .filter(coin => coin.type === 'earn')
              .reduce((sum, coin) => sum + coin.coins, 0);
        
            const totalPay = coins
              .filter(coin => coin.type === 'pay')
              .reduce((sum, coin) => sum + coin.coins, 0);
        
            const balance = totalEarn - totalPay;
        
            res.status(200).json({
              userId,
              coins: balance,
              totalcoins: totalEarn,
              paycoins: totalPay
            });
          } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
          }
        }

}