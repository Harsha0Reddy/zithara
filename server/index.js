const express = require("express")
const app = express()
const cors = require("cors")
const Pool = require("./db")


//middleware
app.use(cors());
app.use(express.json());



//Routes//

// Add a new customer
app.post('/customers', async (req, res) => {
  const { name, age, phone ,location } = req.body;
  try {
    const { rows } = await Pool.query(
      'INSERT INTO customerstable (name, age, phone ,location) VALUES ($1, $2, $3 ,$4) RETURNING *',
      [name, age, phone,location]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//get all customertables data

app.get('/customers', async (req, res) => {
  try {
    const { rows } = await Pool.query('SELECT * FROM customerstable');
    res.json(rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete a customer by ID
app.delete('/customers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Pool.query('DELETE FROM customerstable WHERE id = $1', [id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(8000,() => {+

  console.log("serevr has started on port 8000");
})