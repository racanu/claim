const express = require('express');
const app = express();
const PORT = 8080;
const fs = require('fs');

app.use( express.json() );

function now() {
    const d = new Date();
    const dd = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((a)=>(a < 10 ? '0' + a : a));
    const dt = [d.getHours(), d.getMinutes(), d.getSeconds()].map((a)=>(a < 10 ? '0' + a : a));
    return dd.join('-') + ' ' + dt.join(':');
};

function getClaims() {
    const jsonString = fs.readFileSync('./claims.json', 'utf8');
    console.log("File data:", jsonString);
    return JSON.parse(jsonString);
}

function getClaim(id) {
    return getClaims()[id];
}

function addClaim(id, by) {
    const claim = {
        by: by,
        at: now()
    };

    const jsonString = fs.readFileSync('./claims.json', 'utf8');
    const claims = JSON.parse(jsonString);
    claims[id] = claim;
    fs.writeFileSync('./claims.json', JSON.stringify(claims, null, 2));
}

function deleteClaim(id) {
    const jsonString = fs.readFileSync('./claims.json', 'utf8');
    const claims = JSON.parse(jsonString);
    delete claims[id];
    fs.writeFileSync('./claims.json', JSON.stringify(claims, null, 2));
}

app.get('/claims', (req, res) => {
    res.status(200).header("content-type", "application/json").send(getClaims());
});

app.get('/claim/:id', (req, res) => {
    const { id } = req.params;
    try
    {
        const claim = getClaim(id);

        if (!claim) {
            res.status(404).header("content-type", "text/plain").send("No claim found for " + id);
            return;
        }

        res.status(200).header("content-type", "application/json").send(claim);
    } catch (err) {
        console.log(err);
        res.status(500).header("content-type", "text/plain").send(err);
    }
});

app.put('/claim/:id', (req, res) => {
    const { id } = req.params;
    const { by } = req.body;

    if (!by) {
        res.status(400).header("content-type", "text/plain").send("Need a user name to make a claim");
        return;
    }

    claim = getClaim(id);

    if (claim) {
        res.status(409).header("content-type", "text/plain").send("Claim already exists for " + id);
        return;
    }

    addClaim(id, by);
    res.status(200).header("content-type", "text/plain").send("Claim added for " + id);
});

app.delete('/claim/:id', (req, res) => {
    const { id } = req.params;
    deleteClaim(id);
    res.status(200).header("content-type", "text/plain").send("Claim deleted for " + id);
});

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
);
