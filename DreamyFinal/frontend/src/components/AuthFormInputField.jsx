import React from "react";
import { Field, Input, Label, Description } from "@headlessui/react";

function AuthFormInputField({
	name,
	type,
	label,
	placeholder,
	errorMessage,
	isError,
	onChangeFunction,
}) {
	return (
		<Field className={"flex flex-col gap-2 w-full"}>
			<Label>
				<p className="text-sm text-neutral-500">{label}</p>
			</Label>
			<Input
				className={`font-body text-base transition-all block py-3 px-3 w-full bg-white  border-2 rounded-lg focus:outline-none data-[focus]:!bg-white ${
					isError
						? "border-alert data-[hover]:!bg-red-100/50"
						: "!border-black/5 data-[focus]:!border-blue-500 data-[hover]:!bg-gray-400/10"
				}`}
				name={name}
				type={type}
				placeholder={placeholder}
				onChange={(e) => onChangeFunction(e)}
			/>
			{isError && (
				<Description>
					<p className="text-sm text-alert">{errorMessage}</p>
				</Description>
			)}
		</Field>
	);
}

export default AuthFormInputField;
