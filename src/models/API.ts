import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    core_panel_key: String
})

export default model("api-keys", schema, "api-keys");
