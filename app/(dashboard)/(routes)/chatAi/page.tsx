"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Heading from "@/app/components/Heading";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LuMessageSquare } from "react-icons/lu";
import toast from "react-hot-toast";
import axios from "axios";
import { ChatCompletionRequestMessage } from "openai";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/app/components/ui/form";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { Input } from "@/app/components/ui/input";
import Empty from "@/app/components/Empty";
import { Loading } from "@/app/components/Loading";

const ChatAi = () => {
  const [chatPrompt, setChatPrompt] = useState<ChatCompletionRequestMessage[]>(
    []
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...chatPrompt, userMessage];

      const response = await axios.post("/api/chatAI", {
        chatPrompt: newMessages,
      });

      setChatPrompt((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error) {
      //TODO: open pro model
      console.log("error", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Chat AI"
        subtitle="An advanced conversational AI model"
        icon={<LuMessageSquare />}
        iconColor="text-violet-500 text-[25px] font-bold"
        iconBackground="bg-violet-200/40 p-2 md:p-4 rounded-lg"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" lg:flex lg:items-center lg:justify-between  gap-5 p-1 md:p-2 border-gray-500 border-2 w-full my-7 md:my-10 rounded-xl"
        >
          <FormField
            name={"prompt"}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder=" Write your prompt here......"
                    className="   border-0 focus-visible:ring-0 focus-visible:ring-transparent rounded-lg p-2  outline-none  md:w-[50px] lg:w-[1300px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <button
            disabled={isLoading}
            className={` text-white hover:bg-violet-700 bg-violet-500 px-1 py-1 md:px-2 md:py-3 rounded-lg font-medium font-Rubik  md:w-[12%] text-sm md:text-base w-full mt-10 md:mt-0`}
          >
            Generate Chat
          </button>
        </form>
      </Form>
      <div className=" space-y-4 mt-4">
        {isLoading && (
          <div className=" bg-white p-8 rounded-lg flex justify-center items-center w-full bg-muted">
            <Loading />
          </div>
        )}
        {chatPrompt.length === 0 && !isLoading && (
          <div>
            <Empty lable="No Conversition Started." />
          </div>
        )}
        <div>
          {chatPrompt.map((message) => (
            <div key={message.content}>{message.content}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatAi;
