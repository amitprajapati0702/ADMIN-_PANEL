// import React from "react";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";
// import { Col, Container, Input, Label, Row } from "reactstrap";

// const StaffAddEditPage = () => {
//   const { t } = useTranslation();
//   const nevigate = useNavigate();

//   const handleBack = () => {
//     nevigate("/staff");
//   };

//   return (
//     <>
//       <Container fluid>
//         <div className="center_content_head">
//           <span>{t("addStaff")}</span>
//         </div>
//         <div className="staffBodySection">
//           <Row>
//             <Col>
//               <div className="mainStaffForm">
//                 <div>
//                   <Row md={2}>
//                     <div className="mb-3">
//                       <Label htmlFor="firstName" className="form-label">
//                         {t("firstName")}
//                       </Label>
//                       <Input
//                         type="text"
//                         className="form-control"
//                         id="firstName"
//                         placeholder="Enter First Name"
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <Label htmlFor="lastName" className="form-label">
//                         {t("lastName")}
//                       </Label>
//                       <Input
//                         type="text"
//                         className="form-control"
//                         id="lastName"
//                         placeholder="Enter Last Name"
//                       />
//                     </div>
//                   </Row>
//                   <Row md={2}>
//                     <div className="mb-3">
//                       <Label htmlFor="email" className="form-label">
//                         {t("email")}
//                       </Label>
//                       <Input
//                         type="text"
//                         className="form-control"
//                         id="email"
//                         placeholder="Enter Email"
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <Label htmlFor="phone" className="form-label">
//                         {t("phone")}
//                       </Label>
//                       <Input
//                         type="text"
//                         className="form-control"
//                         id="phone"
//                         placeholder="Enter Phone"
//                       />
//                     </div>
//                   </Row>
//                   <Row md={2}>
//                     <div className="mb-3">
//                       <Label htmlFor="Role" className="form-label">
//                         {t("Role")}
//                       </Label>
//                       <Input
//                         type="text"
//                         className="form-control"
//                         id="Role"
//                         placeholder="Enter Role"
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <Label htmlFor="password" className="form-label">
//                         {t("password")}
//                       </Label>
//                       <Input
//                         type="text"
//                         className="form-control"
//                         id="password"
//                         placeholder="Enter Password"
//                       />
//                     </div>
//                   </Row>
//                   <button
//                     type="button"
//                     className="btn text-white float-start back mt-4 rounded-3"
//                     style={{ backgroundColor: "#2c008a" }}
//                     onClick={handleBack}
//                   >
//                     {t("back")}
//                   </button>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div>
//       </Container>
//     </>
//   );
// };

// export default StaffAddEditPage;
