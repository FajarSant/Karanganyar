module.exports = async (req, res) => {
    // Kode untuk fungsi serverless di sini
    const data = { message: 'Ini adalah contoh fungsi serverless di Vercel.' };
    
    res.status(200).json(data);
  };
  