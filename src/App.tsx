import React, { useCallback } from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import transformAddress from "./core/models/address";
import useFormState from "@/hooks/useFormState";
import { BASE_URL } from "./utils/constants";
import Form from "@/components/Form/Form";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

function App() {
  /**
   * Form fields states
   * DONE: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const { fields, onChange, resetFields } = useFormState({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });
  const { postCode, houseNumber, firstName, lastName, selectedAddress } =
    fields;
  /**
   * Results states
   */
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /** DONE: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);
    setLoading(true);
    if (!postCode || !houseNumber) {
      setError("Post code and house number are mandatory!");
      return;
    }

    try {
      const encodedPostCode = encodeURIComponent(postCode);
      const encodedHouseNumber = encodeURIComponent(houseNumber);
      const params = new URLSearchParams();
      params.append("postcode", encodedPostCode);
      params.append("streetnumber", encodedHouseNumber);

      const response = await fetch(
        `${BASE_URL}/api/getAddresses?${params.toString()}`
      );
      const data = await response.json();
      if (response.ok) {
        const transformedAddresses = data.details.map(transformAddress);
        setAddresses(transformedAddresses);
        return;
      }
      throw new Error(data.errormessage);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch addresses"
      );
    } finally {
      setLoading(false);
    }
  };

  /** DONE: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = useCallback(
    (e: React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!fields.firstName || !fields.lastName) {
        setError("First name and last name fields mandatory!");
        return;
      }
      if (!fields.selectedAddress || !addresses.length) {
        setError(
          "No address selected, try to select an address or find one if you haven't"
        );
        return;
      }
      const foundAddress = addresses.find(
        (address) => address.id === fields.selectedAddress
      );
      if (!foundAddress) {
        setError("Selected address not found");
        return;
      }
      setError("");
      addAddress({
        ...foundAddress,
        firstName: fields.firstName,
        lastName: fields.lastName,
      });
    },
    [fields, addresses, addAddress]
  );

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          label="🏠 Find an address"
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: fields.postCode,
                onChange: onChange,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                value: fields.houseNumber,
                onChange: onChange,
              },
            },
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={onChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {fields.selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: fields.firstName,
                  onChange: onChange,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: fields.lastName,
                  onChange: onChange,
                },
              },
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}
        {/* DONE: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* DONE: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            resetFields();
            setAddresses([]);
            setError(undefined);
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
