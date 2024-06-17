import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";
import { toast } from "react-toastify";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { loadStripe } from "@stripe/stripe-js";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const [emailData, setEmailData] = useState("");

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/properties/${listingId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setListing(data);
      setLoading(false);
    } catch (err) {
      toast.error("Fetch Listing Details Failed");
      // console.log("Fetch Listing Details Failed", err.message);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  // console.log(listing);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Calculate the difference in day unit

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!customerId) {
        toast.error("Please Login in First to Book properties");
        navigate("/login");
        return;
      }

      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      // Step : Book the property
      const bookingResponse = await bookProperty(bookingForm);
      // if (!bookingResponse.success) {
      //   toast.error("Booking failed. Please try again.");
      //   return;
      // }

      // Step : Send Email
      const emailResponse = await sendConfirmationEmail(bookingForm);
      // if (!emailResponse.success) {
      //   toast.error("Email sending failed. Please try again.");
      //   return;
      // }

      // Step : Make Payment
      const paymentResponse = await makePayment(bookingForm);
      // if (!paymentResponse.success) {
      //   toast.error("Payment failed. Please try again.");
      //   return;
      // }

      toast.success("Booking, Payment, and Email sent successfully.");
      navigate(`/${customerId}/trips`);
    } catch (err) {
      toast.error("Submit Booking Failed.");
    }
  };

  const makePayment = async (bookingForm) => {
    try {
      const body = {
        amount: bookingForm.totalPrice,
        listingName: listing.title,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        listingPhoto: listing.listingPhotoPaths[0],
      };

      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch("http://localhost:5000/payment/checkout", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const session = await response.json();

      const stripe = await loadStripe(
        process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
      );
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (session.success == false) {
        console.error("Error in Stripe checkout:", result.error.message);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error("Error during payment:", error.message);
      return { success: false };
    }
  };

  const bookProperty = async (bookingForm) => {
    try {
      const response = await fetch("http://localhost:5000/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      if (!response.ok) {
        toast.error("Error booking property");
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      toast.error("Error booking property");
      return { success: false };
    }
  };

  const sendConfirmationEmail = async (bookingForm) => {
    try {
      const response = await fetch("http://localhost:5000/payment/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailData,
          subject: "Booking Confirmation",
          text: `Your booking for ${listing.title} from ${bookingForm.startDate} to ${bookingForm.endDate} is confirmed. Total Price: ${bookingForm.totalPrice}`,
        }),
      });

      if (!response.ok) {
        console.error("Error sending email:", response.statusText);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error("Error sending email:", error.message);
      return { success: false };
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item) => (
            <img
              src={`http://localhost:5000/${item.replace("public", "")}`}
              alt="listing photo"
            />
          ))}
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={`http://localhost:5000/${listing.creator.profileImagePath.replace(
              "public",
              ""
            )}`}
          />
          <h3>Hosted by {listing.creator.name}</h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  ${listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <input
                type="text"
                value={emailData}
                onChange={(e) => setEmailData(e.target.value)}
                placeholder="Write your email to get Booking Confirmation"
                style={{
                  marginTop: "15px",
                  marginBottom: "-35px",
                  width: "100%",
                  height: "47px",
                  border: "1px solid red", // Initial border style
                  padding: "8px",
                  paddingLeft: "15px",
                  borderRadius: "9px",
                  transition: "border-color 0.3s ease-in-out", // Smooth transition for border color change
                }}
              />

              <button className="button" type="submit" onClick={handleSubmit}>
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ListingDetails;
