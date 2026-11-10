import mongoose from 'mongoose';

export const STATUSES = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'];
export const INTERVIEW_TYPES = ['', 'Phone screen', 'Technical', 'Behavioural', 'On-site'];

// Dates are stored as "YYYY-MM-DD" strings so they never shift with time zones.
const dateField = {
  type: String,
  default: '',
  validate: {
    validator: (v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v),
    message: 'Dates must look like YYYY-MM-DD',
  },
};

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: [true, 'Company is required'], trim: true, maxlength: 100 },
    position: { type: String, required: [true, 'Role is required'], trim: true, maxlength: 100 },
    status: { type: String, enum: STATUSES, default: 'Applied' },
    appliedDate: dateField,
    location: { type: String, trim: true, default: '', maxlength: 100 },
    salary: { type: Number, min: 0, default: null },
    interviewDate: dateField,
    interviewType: { type: String, enum: INTERVIEW_TYPES, default: '' },
    followUpDate: dateField,
    jobLink: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (v) => v === '' || /^https?:\/\//i.test(v),
        message: 'The job posting link must start with http:// or https://',
      },
    },
    contact: { type: String, trim: true, default: '', maxlength: 200 },
    notes: { type: String, default: '', maxlength: 2000 },
  },
  { timestamps: true }
);

jobSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  delete obj.user;
  return obj;
};

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
