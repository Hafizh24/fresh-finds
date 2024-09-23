export const TABS = [
    {
        label: "Category",
        value: 0,
    },
    {
        label: "Sub category",
        value: 1,
    },
];

export const TABS_DISCOUNT_VOUCHER = [
    {
        label: "Discount",
        value: 0,
    },
    {
        label: "Voucher",
        value: 1,
    },
];

export const AdminCSVHeaders = [
    { label: "Name", key: "name" },
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    { label: "Branch Name", key: "branchName" },
    { label: "Account registered At", key: "formattedCreatedAt" }
];

export const CustomerCSVHeaders = [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" },
    { label: "Gender", key: "gender" },
    { label: "Referral Code", key: "referral_code" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Account registered At", key: "formattedCreatedAt" }
];

export const ProductCSVHeaders = [
    { label: "Name", key: "name" },
    { label: "Description", key: "description" },
    { label: "Price", key: "price" },
    { label: "Category", key: "Category.name" },
    { label: "Subcategory", key: "SubCategory.name" },
    { label: "Weight (gr)", key: "weight" },
];

export const ProductBranchCSVHeaders = [
    { label: "Product Name", key: "Product.name" },
    { label: "Stock", key: "stock" },
    { label: "Branch", key: "Branch.name" },
];