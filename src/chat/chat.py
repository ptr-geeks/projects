import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import hashlib, websockets, asyncio, socket, threading, json, base64, re
import websockets.server
import websockets.client

class Chat:
    def __init__(self):
        self.PORT = 5432
        self.BANNED_HASH, self.NICKNAME_HASH = self.sha256_encode("banned"), self.sha256_encode("nickname")
        self.chat_thread = threading.Thread(target = self.chat_menu, daemon = True)
        self.json_message = {"message": "", "file": None, "command": None}

        self.root = tk.Tk()
        self.root.geometry("300x300")
        self.root.title("Chat Setup")

        tab_control = ttk.Notebook(self.root)
        join_tab = ttk.Frame(tab_control)
        host_tab = ttk.Frame(tab_control)
        tab_control.add(join_tab, text="Join a Chat")
        tab_control.add(host_tab, text="Host a Chat")
        tab_control.pack(expand=1, fill="both")

        # Join menu
        join_mainframe = ttk.Frame(join_tab)
        join_mainframe.pack(side="top", anchor="center", expand=True)
        join_nickname_label = ttk.Label(join_mainframe, text="Nickname:")
        join_nickname_label.grid(row=0, column=0, sticky="W", pady=5)
        self.join_nickname_entry = ttk.Entry(join_mainframe, width=15)
        self.join_nickname_entry.grid(row=0, column=1, padx=5)

        join_ip_label = ttk.Label(join_mainframe, text="IP:")
        join_ip_label.grid(row=1, column=0, sticky="W")
        self.join_ip_entry = ttk.Entry(join_mainframe, width=15)
        self.join_ip_entry.grid(row=1, column=1)
        #self.ip_entry.bind("<Return>", lambda event: password_label.focus())

        join_password_label = ttk.Label(join_mainframe, text="Password:")
        join_password_label.grid(row=2, column=0, sticky="W")
        self.join_password_entry = ttk.Entry(join_mainframe, width=12)
        self.join_password_entry.grid(row=2, column=1)
        self.join_password_entry.bind("<Return>", lambda event: self.join_chat())

        join_button = ttk.Button(join_mainframe, text="Join", command=self.join_chat)
        join_button.grid(row=3, column=0, columnspan=2, pady=5)

        # Host menu
        host_mainframe = ttk.Frame(host_tab)
        host_mainframe.pack(side="top", anchor="center", expand=True)
        host_nickname_label = ttk.Label(host_mainframe, text="Nickname:")
        host_nickname_label.grid(row=0, column=0, sticky="W", pady=5)
        self.host_nickname_entry = ttk.Entry(host_mainframe, width=15)
        self.host_nickname_entry.grid(row=0, column=1, padx=5)

        host_password_label = ttk.Label(host_mainframe, text="Password:")
        host_password_label.grid(row=1, column=0, sticky="W")
        self.host_password_entry = ttk.Entry(host_mainframe, width=12)
        self.host_password_entry.grid(row=1, column=1)
        self.host_password_entry.bind("<Return>", lambda event: self.host_chat())

        host_button = ttk.Button(host_mainframe, text="Host", command=self.host_chat)
        host_button.grid(row=2, column=0, columnspan=2, pady=5)

        self.root.mainloop()

    def join_chat(self):
        self.host = False
        self.nickname, self.join_ip, self.join_password = self.join_nickname_entry.get(), self.join_ip_entry.get(), self.join_password_entry.get()
        self.join_ip = "127.0.0.1"#temporary

        if not (1 <= len(self.nickname) <= 20 and 7 <= len(self.join_ip) <= 15 and 1 <= len(self.join_password) <= 50):
            messagebox.showwarning("Invalid Credentials", "Credential length out of bounds (maximum length: nickname - 20, ip - 15, password - 50).")
            return
        if not (self.nickname.isascii() and self.join_ip.replace(".", "").isnumeric() and self.join_password.isascii()):
            messagebox.showwarning(message = "Invalid credentials.")
            return
        
        self.root.destroy()
        self.chat_thread.start()

        async def handler():
            async with websockets.client.connect(f"ws://{self.join_ip}:{self.PORT}") as websocket:
                self.websocket = websocket
                await websocket.send(json.dumps({
                    "ip": socket.gethostbyname(socket.gethostname()),
                    "nickname": self.nickname
                }))
                current_rolling_code = await asyncio.wait_for(websocket.recv(), 3)
                if current_rolling_code == self.BANNED_HASH:
                    messagebox.showerror("Banned", "You are banned from this chat!")
                elif current_rolling_code == self.NICKNAME_HASH:
                    messagebox.showerror("Nickname Already In Use", "The nickname you chose, is already in use by another user. Please change it.")
                await websocket.send(self.sha256_encode(self.join_password + current_rolling_code))
                self.json_message["message"] = f"SYSTEM: \"{self.nickname}\" has joined the chat."
                await websocket.send(json.dumps(self.json_message))
                self.json_message["message"] = ""
                self.update_feed("SYSTEM: You have joined the chat.")

                while True:
                    message = await self.websocket.recv()
                    message = json.loads(message)
                    print(f"cli received: {message}")

                    if message["command"] and message["command"][1] == self.nickname:
                        if message["command"][0] == "kick":
                            self.json_message["message"] = f"SYSTEM: \"{self.nickname}\" has been kicked."
                            await self.websocket.send(json.dumps(self.json_message))
                            messagebox.showinfo("Kicked", "You have been kicked!")
                            await websocket.close()
                        elif message["command"][0] == "ban":
                            self.json_message["message"] = f"SYSTEM: \"{self.nickname}\" has been banned."
                            await self.websocket.send(json.dumps(self.json_message))
                            messagebox.showinfo("Banned", "You have been banned!")
                            await websocket.close()
                        elif message["command"][0] == "rename":
                            self.json_message["message"] = f"SYSTEM: \"{self.nickname}\" has been renamed to \"{message['command'][2]}\"."
                            await self.websocket.send(json.dumps(self.json_message))
                            self.json_message["message"] = ""
                            self.nickname = message["command"][2]
                            self.update_feed(f"SYSTEM: You have been renamed to \"{self.nickname}\".")
                    if message["file"]:
                        self.update_feed(message["message"] + f"\nATTACHMENT: \"{message['file'][0]}\"")
                        
                        filename = filedialog.asksaveasfilename(initialdir = "./", initialfile = message["file"][0])
                        if filename:
                            with open(filename, "wb") as file:
                                file.write(base64.b64decode(message["file"][1].encode()))
                    elif message["message"]: self.update_feed(message["message"])
        
        asyncio.run(handler())
        #self.root.destroy()
        #messagebox.showerror("Disconnected", "The host has disconnected, or you have been kicked.")
        #self.__init__()

    def host_chat(self):
        self.host = True
        self.rolling_code, self.client_websockets, self.client_info, self.ban_ip_list = 0, [], {}, set()
        self.nickname, self.host_ip, self.host_password = self.host_nickname_entry.get(), socket.gethostbyname(socket.gethostname()), self.host_password_entry.get()
        self.host_ip = "127.0.0.1"#temporary
        
        if not (1 <= len(self.nickname) <= 20 and 1 <= len(self.host_password) <= 50):
            messagebox.showwarning("Invalid Credentials", "Credential length out of bounds (maximum length: nickname - 20, password - 50).")
            return
        if not (self.nickname.isascii() and self.host_ip.replace(".", "").isnumeric() and self.host_password.isascii()):
            messagebox.showwarning(message = "Invalid credentials.")
            return

        self.root.destroy()
        self.chat_thread.start()

        async def handler(websocket):
            self.websocket = websocket
            client_data = await asyncio.wait_for(websocket.recv(), 3)
            client_data = json.loads(client_data)

            if client_data["ip"] in self.ban_ip_list:
                await websocket.send(self.BANNED_HASH)
                await websocket.close()
            if client_data["nickname"] in tuple(self.client_info.values()) + (self.nickname, ):
                await websocket.send(self.NICKNAME_HASH)
                await websocket.close()
            hashed_rolling_code = self.sha256_encode(str(self.rolling_code))
            await websocket.send(hashed_rolling_code)
            self.rolling_code += 1
            client_password = await asyncio.wait_for(websocket.recv(), 3) # recieving with timeout
            
            if client_password == self.sha256_encode(self.host_password + hashed_rolling_code):
                i = len(self.client_websockets)
                self.client_websockets.append(websocket)
                self.client_info[client_data["ip"]] = client_data["nickname"]

                async for msg in websocket:
                    message = json.loads(msg)
                    print(f"host received: {message}")
                    
                    if message["file"]:
                        self.update_feed(message["message"] + f"\nATTACHMENT: \"{message['file'][0]}\"")
                        
                        filename = filedialog.asksaveasfilename(initialdir = "./", initialfile = message["file"][0])
                        if filename:
                            with open(filename, "wb") as file:
                                file.write(base64.b64decode(message["file"][1].encode())) # encode from string to bytestring
                    elif message["message"]: self.update_feed(message["message"])
                    
                    for client_websocket in self.client_websockets[:i] + self.client_websockets[i+1:]:
                        await client_websocket.send(msg)
            else: await websocket.close()
        
        async def main():
            async with websockets.server.serve(handler, self.host_ip, self.PORT):
                await asyncio.Future() # run forever
        
        asyncio.run(main())
    
    def chat_menu(self):
        self.root = tk.Tk()
        self.root.geometry("900x600")
        self.root.title("Chat")
        #root.attributes("-fullscreen", True)

        self.dark_button_style = ttk.Style()
        self.dark_button_style.configure("TButton", background="SystemButtonFace")

        mode = tk.StringVar(self.root)
        self.theme_frame = tk.Frame(self.root)
        self.theme_frame.pack(side="top", anchor="e", pady=10, padx=10)
        self.theme_label = ttk.Label(self.theme_frame, text = "Theme:")
        self.theme_label.grid(row=0, column=0, padx=5)
        self.theme_menu = ttk.OptionMenu(self.theme_frame, mode, "Light", "Light", "Blue", "Dark", command=self.update_mode)
        self.theme_menu.grid(row=0, column=1, sticky="wne")

        mainframe = tk.Frame(self.root)
        mainframe.pack(side="top", anchor="center", expand=True)

        message_frame = tk.Frame(mainframe)
        message_frame.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        self.message_display = tk.Text(message_frame, wrap=tk.WORD, state=tk.DISABLED)
        scrollbar = tk.Scrollbar(message_frame, command=self.message_display.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.message_display.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.message_display.config(yscrollcommand=scrollbar.set)

        self.input_frame = tk.Frame(mainframe, pady=5)
        self.input_frame.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        self.message_entry = tk.Text(self.input_frame, wrap=tk.WORD, height=4)
        self.message_entry.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.message_entry.bind("<Control-Return>", lambda event: self.send_message())
        send_button = ttk.Button(self.input_frame, text="Send", command=self.send_message, style="TButton")
        send_button.pack(side=tk.RIGHT)
        attach_button = ttk.Button(self.input_frame, text="Attach", command=self.append_file, style="TButton")
        attach_button.pack(side=tk.RIGHT, padx=5)

        self.root.mainloop()
        asyncio.run(self.websocket.close())
    
    def update_feed(self, message):
        self.message_display.config(state=tk.NORMAL)
        self.message_display.insert(tk.END, message + "\n")
        self.message_display.config(state=tk.DISABLED)
        self.message_display.see(tk.END)

    def send_message(self):
        message = self.message_entry.get("1.0", tk.END).strip()
        
        if (message and 1 <= len(message) <= 10_000) or self.json_message["file"]:
            if self.host and message[:4] == "!su ":
                msg = message[4:]
                components = re.findall(r'"([^"]*)"', msg)
                
                if msg == "banlist":
                    self.update_feed(f"{self.nickname} (You): {message}")
                    self.message_entry.delete("1.0", tk.END)
                    if self.ban_ip_list:
                        self.update_feed("SYSTEM: Ban list -> " + ", ".join(f"\"{self.client_info[ban]}\" ({ban})" for ban in self.ban_ip_list))
                    else:
                        self.update_feed("SYSTEM: Ban list -> empty")
                    return "break"
                
                cmd = msg[:msg.find(" ")]
                ip = tuple(self.client_info.keys())[tuple(self.client_info.values()).index(components[0])]
                self.json_message["command"] = [cmd] + components
                if cmd == "unban":
                    self.ban_ip_list.remove(ip)
                    self.update_feed(f"{self.nickname} (You): {message}\nSYSTEM: \"{components[0]}\" ({ip}) has been unbanned.")
                    del self.client_info[ip]
                    self.message_entry.delete("1.0", tk.END)
                    return "break"
                elif cmd == "kick": del self.client_info[ip]
                elif cmd == "ban": self.ban_ip_list.add(ip)
                return "break"
            
            self.json_message["message"] = f"{self.nickname}: {message}"
            asyncio.run(self.websocket.send(json.dumps(self.json_message))) # serialize the data and send it
            self.message_entry.delete("1.0", tk.END)
            
            if self.json_message["file"]:
                self.update_feed(f"{self.nickname} (You): {message}" + ("\n" if message else "") + f"ATTACHMENT: \"{self.json_message['file'][0]}\"")
            else: self.update_feed(f"{self.nickname} (You): {message}")
            self.json_message = {"message": "", "file": None, "command": None}
        else: messagebox.showwarning("Invalid message length", "A message must be between 1 and 10000 in length.")
        
        return "break"
    
    def append_file(self):
        filename = filedialog.askopenfilename(initialdir = "./")
        
        if filename:
            with open(filename, "rb") as file:
                self.json_message["file"] = [filename.split("/")[-1], base64.b64encode(file.read()).decode()] # decode from bytestring to string (we can only send strings through websockets) 
        else: self.json_message["file"] = None
    
    def update_mode(self, theme):
        if theme == "Light":
            self.root.config(bg="SystemButtonFace")
            self.theme_frame.config(bg="SystemButtonFace")
            self.theme_label.config(cnf={"background": "SystemButtonFace", "foreground": "SystemWindowText"})
            self.input_frame.config(bg="SystemButtonFace")
            self.message_display.config(bg="SystemWindow", fg="SystemWindowText")
            self.message_entry.config(bg="SystemWindow", fg="SystemWindowText")
            self.dark_button_style.configure("TButton", background="SystemButtonFace")
        elif theme == "Blue":
            self.root.config(bg="#005b96")
            self.theme_frame.config(bg="#005b96")
            self.theme_label.config(cnf={"background": "#005b96", "foreground": "#f2f3f5"})
            self.input_frame.config(bg="#005b96")
            self.message_display.config(bg="#bde0fe", fg="SystemWindowText")
            self.message_entry.config(bg="#bde0fe", fg="SystemWindowText")
            self.dark_button_style.configure("TButton", background="#005b96")
        else:
            #print(self.message_entry.cget("background"))
            self.root.config(bg="#1e1f22")
            self.theme_frame.config(bg="#1e1f22")
            self.theme_label.config(cnf={"background": "#1e1f22", "foreground": "#f2f3f5"})
            self.input_frame.config(bg="#1e1f22")
            self.message_display.config(bg="#313338", fg="#f2f3f5")
            self.message_entry.config(bg="#313338", fg="#f2f3f5", insertbackground="#f2f3f5")
            self.dark_button_style.configure("TButton", background="#313338")
    
    def sha256_encode(self, string):
        return hashlib.sha256(string.encode("utf-8")).hexdigest() # encode string to bytestring and then back

chat = Chat()
