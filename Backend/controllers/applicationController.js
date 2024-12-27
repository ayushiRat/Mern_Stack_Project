import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {Application} from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import { Job } from "../models/jobSchema.js";

export const employerGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const { role } = req.user;
    if (role === "Job Seeker") {
       return next(
         new ErrorHandler(
           "Job seeker is not allowed to access this resources!",
           400
         )
       );
     }
     const {_id} = req.user;
     const applications = await Application.find({'employerID.user':_id});
     res.status(200).json({
        success: true,
        applications
     })
})

export const jobseekerGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const { role } = req.user;
    if (role === "Employer") {
       return next(
         new ErrorHandler(
           "Employer is not allowed to access this resources!",
           400
         )
       );
     }
     const {_id} = req.user;
     const applications = await Application.find({'applicantID.user':_id});
     res.status(200).json({
        success: true,
        applications
     })
})


export const jobSeekerDeleteApplication = catchAsyncError(async(req,res,next)=>{
    const { role } = req.user;
    if (role === "Employer") {
       return next(
         new ErrorHandler(
           "Employer is not allowed to access this resources!",
           400
         )
       );
     }
     const {id} = req.params;
     const application = await Application.findById(id);
     if(!application){
        return next(new ErrorHandler("Oops, application not found!", 404));
     }
     await application.deleteOne();
     res.status(200).json({
        success:true,
        message: "Application Deleted Successfully!",
     })
});


export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer is not allowed to access this resource!", 400)
    );
  }

  // Ensure resume is provided
  if (!req.files || !req.files.resume) {
    return next(new ErrorHandler("Resume File Required", 400));
  }

  const { resume } = req.files;

  // Validate file type
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler(
        "Invalid file type. Please upload your resume in PNG, JPG, or WEBP format.",
        400
      )
    );
  }

  // Upload to Cloudinary
  const cloudinaryResponse = await cloudinary.v2.uploader.upload(resume.tempFilePath, {
    folder: "resumes",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown");
    return next(new ErrorHandler("Failed to upload resume.", 500));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;

  // Validate job ID
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  // Ensure all fields are provided
  if (!name || !email || !coverLetter || !phone || !address) {
    return next(new ErrorHandler("Please fill all fields!", 400));
  }

  const applicantID = { user: req.user._id, role: "Job Seeker" };
  const employerID = { user: jobDetails.postedBy, role: "Employer" };

  // Create application
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Application Submitted",
    application,
  });
});


