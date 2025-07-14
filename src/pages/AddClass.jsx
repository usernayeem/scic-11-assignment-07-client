import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiBook,
  FiUser,
  FiMail,
  FiDollarSign,
  FiFileText,
  FiImage,
  FiPlus,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const AddClass = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      title: "",
      price: "",
      description: "",
    },
    mode: "onBlur",
  });

  // Validation rules
  const validationRules = {
    title: {
      required: "Class title is required",
    },
    price: {
      required: "Price is required",
    },
    description: {
      required: "Description is required",
    },
  };

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      clearErrors("image");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageUrl("");
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Upload image to imgbb
  const uploadImageToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setIsUploadingImage(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );

      if (response.data.success) {
        return response.data.data.url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image to imgbb");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      // Validate image is selected
      if (!selectedImage && !uploadedImageUrl) {
        setError("image", {
          type: "required",
          message: "Class image is required",
        });
        return;
      }

      let imageUrl = uploadedImageUrl;

      // Upload image if not already uploaded
      if (selectedImage && !uploadedImageUrl) {
        toast.info("Uploading image...");
        imageUrl = await uploadImageToImgbb(selectedImage);
        setUploadedImageUrl(imageUrl);
        toast.success("Image uploaded successfully!");
      }

      const classData = {
        title: data.title,
        teacherName: user?.displayName || "Unknown",
        teacherEmail: user?.email || "",
        teacherUid: user?.uid,
        price: parseFloat(data.price),
        description: data.description,
        image: imageUrl,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API}/classes`,
        classData
      );

      if (response.data.success) {
        toast.success("Class added successfully! Awaiting admin approval.");
        navigate("/teacher-dashboard/my-classes");
      } else {
        toast.error(response.data.message || "Failed to add class");
      }
    } catch (error) {
      console.error("Error adding class:", error);
      if (error.message.includes("imgbb")) {
        toast.error("Failed to upload image. Please try again.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add class. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Add New Class
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Create a new class for your students. Your class will be reviewed by
          admin before being published.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Class Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBook className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="title"
                type="text"
                {...register("title", validationRules.title)}
                className={`block w-full pl-10 pr-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                  errors.title
                    ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter class title"
                aria-invalid={errors.title ? "true" : "false"}
              />
            </div>
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Teacher Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teacher Name */}
            <div>
              <label
                htmlFor="teacherName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Teacher Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="teacherName"
                  type="text"
                  value={user?.displayName || ""}
                  disabled
                  className="block w-full pl-10 pr-3 py-3 text-base border rounded-xl text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Teacher Email */}
            <div>
              <label
                htmlFor="teacherEmail"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Teacher Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="teacherEmail"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="block w-full pl-10 pr-3 py-3 text-base border rounded-xl text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Price Field */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Price (USD) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", validationRules.price)}
                className={`block w-full pl-10 pr-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                  errors.price
                    ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter class price"
                aria-invalid={errors.price ? "true" : "false"}
              />
            </div>
            {errors.price && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Class Description *
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                rows={6}
                {...register("description", validationRules.description)}
                className={`block w-full pl-10 pr-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 resize-none ${
                  errors.description
                    ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Describe your class, what students will learn, prerequisites, etc."
                aria-invalid={errors.description ? "true" : "false"}
              />
            </div>
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class Image *
            </label>

            {!imagePreview ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  errors.image
                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-[#5D5CDE] dark:hover:border-[#5D5CDE] bg-gray-50 dark:bg-gray-700/50"
                }`}
              >
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label
                  htmlFor="imageInput"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] bg-opacity-10 rounded-2xl">
                    <FiUpload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Click to upload class image
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF or WebP up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Class preview"
                  className="w-full h-64 object-cover rounded-xl border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
                >
                  <FiX className="w-4 h-4" />
                </button>
                {selectedImage && !uploadedImageUrl && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    Ready to upload
                  </div>
                )}
                {uploadedImageUrl && (
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Uploaded</span>
                  </div>
                )}
              </div>
            )}

            {errors.image && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.image.message}
              </p>
            )}

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload a high-quality image that represents your class content
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-3 px-6 rounded-xl font-semibold text-base hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting || isUploadingImage ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>
                    {isUploadingImage
                      ? "Uploading Image..."
                      : "Adding Class..."}
                  </span>
                </>
              ) : (
                <>
                  <FiPlus className="w-5 h-5" />
                  <span>Add Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
