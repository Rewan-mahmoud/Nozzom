import { useState } from "react";
import Form from "../../components/Form2/Form";
import useAll from "../../hooks/useAll";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { getOptions } from "../../utils/getOption";
import {
  fetchPurchase,
  postPurchase,
  updatePurchase,
} from "../../features/table/purchaseSlice";
import { getToday } from "../../utils/Date";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import Modal from "../../components/Modal/Modal";

const AddPurchase = () => {
  const { dataSource, error, loading, total } = useAll("purchase", fetchPurchase);
    const [modal, setModal] = useState({ open: false, type: "", data: null });
  const { token, role } = useToken();
  const {t} = useTranslation()

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  const [data, setData] = useState({
    customer_id: "",
    paymentType: "",
    date: getToday(),
    files: "",
    invoice_description: "",
    items: [],

  });
  const [errors, setErrors] = useState({});
  const modalData = [
    {
      title: "date",
      name: "date",
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
    },
    {
      title: "payMethod",
      name: "paymentType",
      id: 1,
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      options: [
        { name: "نقدي", value: "cash", id: 0 },
        { name: "شبكة", value: "network", id: 1 },
        { name: "بنكي", value: "bank", id: 2 },
        { name: "اجل", value: "installement", id: 3 },
      ],
      error: "",
    },
    {
      title: "customer",
      name: "customer_id",
      id: 0,
      validation: () => {},
      unique: false,
      required: true,
      type: "select",
      class: "input-group input-class",
      error: "",
      getOptions: () => printOptions("show_customer_all_purchers", "vendors"),
      style: { gridColumn: "1/2" },
      details: true,
    },

    {
      title: "اضافة عرض سعر",
      name: "items",
      id: 5,
      type: "group",
      child: {
        item: [
          {
            name: "product",
            title: "productName",
            id: 0,
            unique: true,
            required: true,
            type: "select",
            getOptions: () =>
              printOptions("productandservices_purchers", "Products"),
            details: true,
          },
       
          {
            name: "description",
            title: "desc",
            id: 1,
            unique: false,
            required: false,
            type: "text",
            details: true,
          },
          {
            name: "quantity",
            title: "quantity",
            id: 2,
            unique: false,
            required: true,
            type: "text",
            details: true,
          },
          {
            name: "piece_price",
            title: "piecePriceB",
            id: 3,
            unique: false,
            required: true,
            type: "text",
            details: true,
          },
          {
            name: "discount",
            title: "discount",
            id: 4,
            value: 0,
            unique: false,
            required: true,
            type: "checkbox",
            details: true,
          },
        ],
      },
    },
    {
      title: "desc",
      name: "invoice_description",
      style: { gridColumn: "1/-1" },
      id: 3,
      unique: false,
      required: false,
      validation: () => {},
      type: "textarea",
      error: "",
      expand: false,
    },
    {
      title: "اضافة ملف",
      name: "files",
      style: { gridColumn: "1/-1" },
      id: 4,
      unique: false,
      required: false,
      validation: () => {},
      type: "file",
      error: "",
      expand: false,
    },
  ];

  const ClientModalData = [
    {
      title: t("vatStatus"),
      name: "taxes_unable",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: t("notregistered"), action: 0 },
        { name: t("registered"), action: 1 },
      ],
      // action: [
      //   "tax_card",
      //   "tax_date",
      //   "street_name",
      //   "building_number",
      //   "plot_identification",
      //   "city",
      //   "region",
      //   "postal_number",
      //   "cr.required",
      // ],
      id: 7,
    },
    {
      title: t("type"),
      name: "type",
      id: 11,
      unique: false,
      // validation: "",
      placeholder: t("cusVen"),
      required: true,
      type: "select",
      options: [
        { name: "مورد", value: "supplier", id: 0, name_en: "vendor" },
        { name: "عميل", value: "customer", id: 1, name_en: "customer" },
      ],
      error: "",
    },
    {
      title: t("arabicName"),
      name: "name",
      id: 0,
      unique: true,
      required: true,
      validation: (value) => {
        if (!/[\u0600-\u06FF\u0660-\u0669,_-]/g.test(value)) {
          return t("warnArabic");
        }
      },
      type: "text",
      error: t("warnArabic"),
    },
    {
      title: t("englishName"),
      name: "name_en",
      id: 1,
      unique: true,
      required: true,
      validation: (value) => {
        if (!/^[^\u0600-\u06FF]+$/.test(value)) {
          return t("warnEnglish");
        }
      },
      type: "text",
      error: t("warnEnglish"),
    },
    {
      title: t("phone"),
      name: "phone",
      id: 3,
      unique: false,
      required: true,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t("warnNumber");
        }
      },
      type: "text",
      error: t("warnNumber"),
    },
    {
      title: t("phone2"),
      name: "phone2",
      id: 4,
      unique: false,
      required: false,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t("warnNumber");
        }
      },
      type: "text",
      error: t("warnNumber"),
    },
    {
      title: t("arabicAddress"),
      name: "address",
      id: 5,
      unique: false,
      required: true,
      validation: (value) => {
        if (!/[\u0600-\u06FF\u0660-\u0669,_-]/g.test(value)) {
          return t("warnArabic");
        }
      },
      type: "text",
      error: t("warnArabic"),
    },
    {
      title: t("englishAddress"),
      name: "address_en",
      id: 6,
      unique: false,
      required: false,
      validation: () => {
        // if (!/^[a-zA-Z0-9\s_-]+$/.test(value)) {
        //   return "يجب ادخال احرف انجليزية";
        // }
      },
      type: "text",
      error: t("warnEnglish"),
    },
    {
      title: t("crNumber"),
      name: "cr",
      id: 2,
      unique: false,
      required: false,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t("warnNumber");
        }
      },
      type: "text",
      error: "",
    },
    {
      title: t("country"),
      name: "country",
      id: 21,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      // options: Object.keys(countryInfo)
      //   // .filter((item) => item === "SA")
      //   .map((item) => ({
      //     value: countryInfo[item].name,
      //     name: countryInfo[item].name,
      //     id: item,
      //   })),
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("vatNumber"),
      name: "tax_card",
      unique: false,
      required: true,
      id: 8,
      validation: (value) => {
        if (!/^3\d{13}3$/.test(value)) {
          // console.log(value.length);
          return t("warn15");
        }
      },
      type: "text",
      error: "هذا الحقل يقبل ارقام فقط!",
    },
    {
      title: t("vatDate"),
      name: "tax_date",
      unique: false,
      id: 9,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
    },
    {
      title: t("legacyIntity"),
      name: "customer_type",
      id: 10,
      unique: false,
      // validation: "",
      type: "radio",
      required: true,
      info: [
        { name: t("person"), action: "individual" },
        { name: t("establishment"), action: "foundation" },
        { name: t("company"), action: "company" },
      ],
      // action: [
      //   "street_name",
      //   "building_number",
      //   "plot_identification",
      //   "city",
      //   "region",
      //   "postal_number",
      // ],
      // options: [
      //   { name: "فرد", value: "individual", id: 0 },
      //   { name: "مؤسسة", value: "foundation", id: 1 },
      //   { name: "شركة", value: "company", id: 2 },
      // ],
      error: "",
    },

    {
      title: t("streetName"),
      name: "street_name",
      id: 13,
      unique: false,
      required: false,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("buildNumber"),
      name: "building_number",
      id: 14,
      unique: false,
      required: true,
      validation: (value) => {
        if (value && (value.length < 4 || value.length > 4)) {
          return t("4 numbers");
        }
      },
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("plotIdentification"),
      name: "plot_identification",
      id: 16,
      unique: false,
      required: true,
      validation: (value) => {
        if (value && (value.length < 4 || value.length > 4)) {
          return t("4 numbers");
        }
      },
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("cityName"),
      name: "city",
      id: 17,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("region"),
      name: "region",
      id: 19,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("postalZone"),
      name: "postal_number",
      id: 18,
      unique: false,
      required: true,
      validation: (value) => {
        if (value && (value.length < 5 || value.length > 5)) {
          return t("5 numbers");
        }
      },
      type: "text",
      error: "",
      class: " w-100 input-group",
    },

    {
      title: "الملف",
      name: "files",
      id: 20,
      unique: false,
      required: false,
      type: "file",
      error: "",
    },

  ];

  return (
    <div className="page-wrapper">
      {loading && <LoadSpinner />}
      {!loading && (
        <Form
          data={data}
          setFormData={setData}
          totalNum={total}
          updateMethod={updatePurchase}
          btn={ "+" }
          modalType={"page"}
          // modalValue={modalValue}
          modal={modal}
          setModal={setModal}
          errors={errors}
          setErrors={setErrors}
          dataSource={dataSource}
          dispatchMethod={postPurchase}
          error={error}
          modalData={modalData}
          className={"table"}
          mainClass={"mainClass formWrapper"}
          // inputClass={"input-class"}
          details={true}
          uri={"/purchaseorder"}
          api={"show_purchaseorder"}
          custom2={["productandservices_purchers", "Products"]}
          custom={["show_customer_all_purchers", "vendors"]}
          note={"sales"}
        />
      )}
          {modal.open && (
        <Modal
          dataSource={dataSource}
          setModal={setModal}
          modalData={ClientModalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          // dispatchMethod={postClients}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          // updateMethod={updateClients}
          // postLoad={postLoad}
          inputClass={"input"}
          //api eddition
          // exludeData={['address_en']}
        />
      )}
   
    </div>
  );
};

export default AddPurchase;
