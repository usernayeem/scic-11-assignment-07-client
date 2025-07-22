import React, { useState, useEffect, useContext } from "react";
import {
  FiEdit3,
  FiTrash2,
  FiEye,
  FiDollarSign,
  FiRefreshCw,
  FiX,
  FiSave,
  FiImage,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiMail,
  FiBook,
  FiUpload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdPending, MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

export const MyClassesTeacher = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedImageUrl, setUpdatedImageUrl] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // React Hook Form for update
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
    setError,
  } = useForm();

  // Fetch teacher's classes with pagination
  const fetchClasses = async (page = currentPage, limit = pageSize) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API}/classes/teacher/${user?.uid}?${params}`
      );

      if (response.data.success) {
        setClasses(response.data.classes);
        setTotalClasses(response.data.totalClasses || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        toast.error("Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchClasses(newPage, pageSize);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchClasses(1, newPageSize);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
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
    setUpdatedImageUrl(selectedClass?.image || "");
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

      // Create a separate axios instance without authorization header for imgbb
      const imgbbAxios = axios.create();
      delete imgbbAxios.defaults.headers.common["Authorization"];

      const response = await imgbbAxios.post(
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

  // Handle update class
  const handleUpdate = (classItem) => {
    setSelectedClass(classItem);
    setValue("title", classItem.title);
    setValue("price", classItem.price);
    setValue("description", classItem.description);
    setUpdatedImageUrl(classItem.image);
    setSelectedImage(null);
    setImagePreview(null);
    setIsUpdateModalOpen(true);
  };

  // Submit update
  const onUpdateSubmit = async (data) => {
    setIsUpdating(true);
    try {
      let finalImageUrl = updatedImageUrl;

      // Upload new image if selected
      if (selectedImage) {
        toast.info("Uploading new image...");
        finalImageUrl = await uploadImageToImgbb(selectedImage);
        toast.success("Image uploaded successfully!");
      }

      // Validate that we have an image
      if (!finalImageUrl) {
        setError("image", {
          type: "required",
          message: "Please upload a class image or keep the current one",
        });
        return;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_API}/classes/${selectedClass._id}/content`,
        {
          title: data.title,
          price: parseFloat(data.price),
          description: data.description,
          image: finalImageUrl,
        }
      );

      if (response.data.success) {
        toast.success("Class updated successfully!");
        setIsUpdateModalOpen(false);
        fetchClasses(currentPage, pageSize);
        reset();
        setUpdatedImageUrl("");
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        toast.error("Failed to update class");
      }
    } catch (error) {
      console.error("Error updating class:", error);
      if (error.message.includes("imgbb")) {
        toast.error("Failed to upload image. Please try again.");
      } else {
        toast.error("Failed to update class. Please try again.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete class with SweetAlert2
  const handleDelete = async (classItem) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${classItem.title}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API}/classes/${classItem._id}`
        );

        if (response.data.success) {
          toast.success("Class deleted successfully!");

          // Check if we need to adjust current page after deletion
          const newTotal = totalClasses - 1;
          const newTotalPages = Math.ceil(newTotal / pageSize);

          // If current page is now empty and not the first page, go to previous page
          if (currentPage > 1 && currentPage > newTotalPages) {
            setCurrentPage(currentPage - 1);
            fetchClasses(currentPage - 1, pageSize);
          } else {
            fetchClasses(currentPage, pageSize);
          }

          Swal.fire({
            title: "Deleted!",
            text: "Your class has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          toast.error("Failed to delete class");
        }
      } catch (error) {
        console.error("Error deleting class:", error);
        toast.error("Failed to delete class");
      }
    }
  };

  // Handle see details
  const handleSeeDetails = (classId) => {
    navigate(`/teacher-dashboard/my-classes/${classId}`);
  };

  // Close modal
  const closeModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedClass(null);
    setUpdatedImageUrl("");
    setSelectedImage(null);
    setImagePreview(null);
    reset();
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <MdPending className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <MdVerified className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <FiX className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return status;
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchClasses();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
          <span className="text-gray-600 dark:text-gray-300">
            Loading your classes...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Classes
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage and view all your created classes
            </p>
          </div>
          <button
            onClick={() => fetchClasses(currentPage, pageSize)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
          <FiBook className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No classes created yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start by creating your first class to share your knowledge with
            students.
          </p>
          <button
            onClick={() => navigate("/teacher-dashboard/add-class")}
            className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Create Your First Class
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Classes Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <div
                  key={classItem._id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Class Image */}
                  <div className="relative h-48">
                    <img
                      src={classItem.image}
                      alt={classItem.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://i.ibb.co/GQzR5BLS/image-not-found.webp";
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(classItem.status)}
                    </div>
                  </div>

                  {/* Class Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 truncate">
                      {classItem.title}
                    </h3>

                    {/* Teacher Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiUser className="w-4 h-4 mr-2" />
                        <span>{classItem.teacherName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiMail className="w-4 h-4 mr-2" />
                        <span>{classItem.teacherEmail}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center mb-4">
                      <span className="text-2xl font-bold text-[#5D5CDE]">
                        ${classItem.price}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-5">
                      {classItem.description}
                    </p>

                    {/* Created Date */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-6">
                      <FiClock className="w-4 h-4 mr-1" />
                      <span>
                        Created:{" "}
                        {new Date(classItem.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdate(classItem)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <FiEdit3 className="w-4 h-4" />
                          <span>Update</span>
                        </button>
                        <button
                          onClick={() => handleDelete(classItem)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleSeeDetails(classItem._id)}
                        disabled={classItem.status !== "approved"}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                          classItem.status === "approved"
                            ? "bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FiEye className="w-4 h-4" />
                        <span>See Details</span>
                      </button>
                      {classItem.status !== "approved" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          Details available after admin approval
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}

          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Left Side: Pagination Info and Page Size Selector */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing{" "}
                  {totalClasses > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(currentPage * pageSize, totalClasses)} of{" "}
                  {totalClasses} classes
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Show:
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                </div>
              </div>

              {/* Right Side: Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FiChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        currentPage === pageNum
                          ? "bg-[#5D5CDE] text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FiEdit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Update Class
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Modify your class details and image
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form
              onSubmit={handleSubmit(onUpdateSubmit)}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Class Title *
                    </label>
                    <input
                      type="text"
                      {...register("title", {
                        required: "Title is required",
                      })}
                      className={`block w-full px-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                        errors.title
                          ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter class title"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("price", {
                        required: "Price is required",
                      })}
                      className={`block w-full px-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                        errors.price
                          ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      rows={6}
                      {...register("description", {
                        required: "Description is required",
                      })}
                      className={`block w-full px-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 resize-none ${
                        errors.description
                          ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Describe your class..."
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Class Image *
                    </label>

                    {/* Current Image Display */}
                    {!imagePreview && updatedImageUrl && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Current Image:
                        </p>
                        <img
                          src={updatedImageUrl}
                          alt="Current class image"
                          className="w-full h-48 object-cover rounded-xl border border-gray-300 dark:border-gray-600"
                          onError={(e) => {
                            e.target.src =
                              "https://i.ibb.co/GQzR5BLS/image-not-found.webp";
                          }}
                        />
                      </div>
                    )}

                    {/* Image Upload Area */}
                    {!imagePreview ? (
                      <div
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
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
                          className="cursor-pointer flex flex-col items-center space-y-3"
                        >
                          <div className="flex items-center justify-center w-12 h-12 bg-[#5D5CDE] bg-opacity-10 rounded-2xl">
                            <FiUpload className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                              Upload new image
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
                          alt="New class preview"
                          className="w-full h-48 object-cover rounded-xl border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={handleImageRemove}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                          New image selected
                        </div>
                      </div>
                    )}

                    {errors.image && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.image.message}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {updatedImageUrl
                        ? "Upload a new image to replace the current one, or keep the current image"
                        : "Please upload an image for your class"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FiX className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || isUploadingImage}
                  className="flex-1 bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdating || isUploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>
                        {isUploadingImage ? "Uploading..." : "Updating..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      <span>Update Class</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
