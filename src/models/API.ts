import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    core_panel_key: String,
    developer_panel_key: String,
    private_panel_key: String,
    public_panel_key: String,
})

export default model("api-keys", schema, "api-keys");
