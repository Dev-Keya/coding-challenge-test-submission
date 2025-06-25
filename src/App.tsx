import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

import Form from "@/components/Form/Form";
/**
 * TODO: Write a custom hook to set form fields in a more generic way:
 * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
 * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
 * - Remove all individual React.useState
 * - Remove all individual onChange handlers, like handlePostCodeChange for example
 * DONE
 */
function useFormFields<T extends Record<string, string>>(initialValues: T) {
  const [fields, setFields] = React.useState<T>(initialValues);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => setFields(initialValues);

  return { fields, onChange, reset };
}

function transformAddress(address: AddressType, houseNumber: string): AddressType {
  return { ...address, houseNumber };
}

/**
 * TODO: Create an <ErrorMessage /> component for displaying an error message
 * DONE
 */
function ErrorMessage({ message }: { message: string }) {
  return <div className={styles.error}>{message}</div>;
}

function App() {
  const { fields, onChange, reset } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { addAddress } = useAddressBook();

  /**
   * TODO: Add a button to clear all form fields.
   * Button must look different from the default primary button, see design.
   * Button text name must be "Clear all fields"
   * On Click, it must clear all form fields, remove all search results and clear all prior
   * error messages
   * DONE
   */
  const clearAllFields = () => {
    reset();
    setAddresses([]);
    setError(undefined);
  };

  /**
   * TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   * DONE
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);
    setLoading(true);

    const baseUrl = process.env.NEXT_PUBLIC_URL || "";

    try {
      const response = await fetch(
        `${baseUrl}/api/getAddresses?postcode=${encodeURIComponent(
          fields.postCode
        )}&streetnumber=${encodeURIComponent(fields.houseNumber)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data: AddressType[] = await response.json();
      const transformed = data.map((addr) => transformAddress(addr, fields.houseNumber));
      setAddresses(transformed);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   * DONE
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fields.firstName.trim() || !fields.lastName.trim()) {
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

    addAddress({ ...foundAddress, firstName: fields.firstName, lastName: fields.lastName });
    reset();
    setAddresses([]);
  };

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
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {/* DONE */}
        <Form
          label="🏠 Find an address"
          loading={loading}
          onFormSubmit={handleAddressSubmit}
          submitText={loading ? "Searching..." : "Find"}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: fields.postCode,
                onChange,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                value: fields.houseNumber,
                onChange,
              },
            },
          ]}
        />
        {addresses.length > 0 &&
          addresses.map((address) => (
            <Radio
              name="selectedAddress"
              id={address.id}
              key={address.id}
              onChange={onChange}
              checked={fields.selectedAddress === address.id}
            >
              <Address {...address} />
            </Radio>
          ))}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {/* DONE */}
        {fields.selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: fields.firstName,
                  onChange,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: fields.lastName,
                  onChange,
                },
              },
            ]}
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {/* DONE */}
        {error && <ErrorMessage message={error} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        DONE */}
        <Button
          type="button"
          onClick={clearAllFields}
          className={styles.clearButton}
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
