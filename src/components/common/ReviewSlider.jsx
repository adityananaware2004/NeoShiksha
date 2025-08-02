import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("🔄 Fetching reviews...")
        
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        
        console.log("📊 Reviews API response:", data)
        
        if (data?.success) {
          setReviews(data?.data || [])
          console.log("✅ Reviews set:", data?.data?.length, "reviews")
          console.log("📋 Review data:", data?.data)
        } else {
          setError("Failed to fetch reviews")
          console.error("❌ Reviews API error:", data)
        }
      } catch (error) {
        console.error("❌ Error fetching reviews:", error)
        setError("Error fetching reviews")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <div className="text-white">
        <div className="my-[50px] h-[200px] max-w-maxContentTab lg:max-w-maxContent flex items-center justify-center">
          <p className="text-center text-richblack-300">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-white">
        <div className="my-[50px] h-[200px] max-w-maxContentTab lg:max-w-maxContent flex items-center justify-center">
          <p className="text-center text-richblack-300">Error loading reviews: {error}</p>
        </div>
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-white">
        <div className="my-[50px] h-[200px] max-w-maxContentTab lg:max-w-maxContent flex items-center justify-center">
          <p className="text-center text-richblack-300">No reviews available yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-white">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent">
        {/* Debug info */}
        <div className="mb-4 text-center text-sm text-richblack-300">
          Found {reviews.length} reviews
        </div>
        
        {/* Swiper Component */}
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {reviews.map((review, i) => {
            console.log("Rendering review:", review);
            return (
              <SwiperSlide key={i}>
                <div className="bg-gradient-to-br from-richblack-800 to-richblack-700 p-6 text-[14px] text-richblack-25 rounded-xl min-h-[200px] w-full max-w-[320px] flex flex-col justify-between border border-richblack-600 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* User Info Section */}
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-12 w-12 rounded-full object-cover flex-shrink-0 border-2 border-yellow-100"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <h1 className="font-bold text-richblack-5 text-sm truncate">
                        {review?.user?.firstName} {review?.user?.lastName}
                      </h1>
                      <h2 className="text-[11px] font-medium text-richblack-400 truncate">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Review Text Section */}
                  <div className="flex-1 mb-2 overflow-hidden">
                    <p className="font-medium text-richblack-25 text-sm leading-relaxed line-clamp-3 break-words">
                      {review?.review?.split(" ").length > truncateWords
                        ? `${review?.review
                            .split(" ")
                            .slice(0, truncateWords)
                            .join(" ")} ...`
                        : review?.review}
                    </p>
                  </div>
                  
                  {/* Rating Section */}
                  <div className="flex items-center justify-between w-full mt-auto">
                    <div className="flex items-center gap-2 flex-1">
                      <h3 className="font-bold text-yellow-100 text-lg">
                        {review?.rating?.toFixed(1)}
                      </h3>
                      <ReactStars
                        count={5}
                        value={review?.rating || 0}
                        size={18}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                    </div>
                    <div className="text-xs text-richblack-400 ml-2 flex-shrink-0">
                      {review?.rating?.toFixed(1)}/5
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider