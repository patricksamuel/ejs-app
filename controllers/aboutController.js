
async function aboutController(req,res) {
    await res.render("about", { });
}
module.exports = { aboutController };
