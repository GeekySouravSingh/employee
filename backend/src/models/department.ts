import mongoose, { Schema, Types } from "mongoose";

export interface IDepartment {
  name: string;
  description: string;
  active: boolean;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(obj, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Department = mongoose.model<IDepartment>(
  "Department",
  departmentSchema,
  "Department"
);

export default Department;
