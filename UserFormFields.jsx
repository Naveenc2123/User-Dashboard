/**
 * UserFormFields
 *
 * Shared form field group used by both AddUser and EditUser.
 * Renders all user input fields with validation error display.
 *
 * Props:
 *  form        – form state object
 *  errors      – validation errors object
 *  handleChange – onChange handler (e) => void
 *
 * Usage:
 *   <UserFormFields form={form} errors={errors} handleChange={handleChange} />
 */

import Input from "./Input";
import SelectInput from "./SelectInput";

const GENDER_OPTIONS = [
  { value: "male",   label: "Male" },
  { value: "female", label: "Female" },
];

const STATUS_OPTIONS = [
  { value: "true",  label: "Active" },
  { value: "false", label: "Inactive" },
];

const UserFormFields = ({ form, errors, handleChange }) => {
  return (
    <div className="flex flex-col gap-4">

      {/* Name */}
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full name"
        error={errors.name}
        required
      />

      {/* Email */}
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="email@example.com"
        error={errors.email}
        required
      />

      {/* Phone */}
      <Input
        label="Phone"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="10-digit phone number"
        error={errors.phone}
        required
      />

      {/* Company + Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company name"
        />
        <Input
          label="Age"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          error={errors.age}
          required
        />
      </div>

      {/* Gender + Fruit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={GENDER_OPTIONS}
          placeholder="Select gender"
        />
        <Input
          label="Favorite Fruit"
          name="favoriteFruit"
          value={form.favoriteFruit}
          onChange={handleChange}
          placeholder="e.g. apple"
        />
      </div>

      {/* Status */}
      <SelectInput
        label="Status"
        name="isActive"
        value={String(form.isActive)}
        onChange={(e) =>
          handleChange({
            target: { name: "isActive", value: e.target.value === "true" },
          })
        }
        options={STATUS_OPTIONS}
        placeholder="Select status"
      />

      {/* Address */}
      <Input
        label="Address"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Street address"
      />

      {/* Latitude + Longitude */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Latitude"
          name="latitude"
          value={form.latitude}
          onChange={handleChange}
          placeholder="e.g. 40.7128"
          error={errors.latitude}
        />
        <Input
          label="Longitude"
          name="longitude"
          value={form.longitude}
          onChange={handleChange}
          placeholder="e.g. -74.0060"
          error={errors.longitude}
        />
      </div>

    </div>
  );
};

export default UserFormFields;
