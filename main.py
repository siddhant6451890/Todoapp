
f,name): self.current_filter=name; self.show_tasks()
    def add_task(self,*args):
        text=self.task_input.text.strip()
        if text:
            self.tasks.append({"text":text,"completed":False,"photo":""}); self.task_input.text=""; self.save_tasks(); self.show_tasks()
    def toggle_done(self,task):
        task["completed"]=not task.get("completed",False); self.save_tasks(); self.show_tasks()
    def delete_task(self,task):
        if task in self.tasks: self.tasks.remove(task); self.save_tasks(); self.show_tasks()
    def clear_completed(self,*args):
        self.tasks=[t for t in self.tasks if not t.get("completed",False)]; self.save_tasks(); self.show_tasks()

    def edit_task(self,task):
        inp=TextInput(text=task.get("text",""),multiline=False)
        save=Button(text="SAVE"); cancel=Button(text="CANCEL")
        box=BoxLayout(orientation="vertical",padding=10,spacing=10); row=BoxLayout(size_hint_y=None,height=55); row.add_widget(save); row.add_widget(cancel); box.add_widget(inp); box.add_widget(row)
        p=Popup(title="EDIT TASK",content=box,size_hint=(.9,.4))
        def do_save(*x):
            if inp.text.strip(): task["text"]=inp.text.strip(); self.save_tasks(); self.show_tasks()
            p.dismiss()
        save.bind(on_press=do_save); cancel.bind(on_press=lambda x:p.dismiss()); p.open()

    def photo_clicked(self,task):
        chooser=FileChooserListView(filters=["*.jpg","*.jpeg","*.png"])
        select=Button(text="SELECT PHOTO",size_hint_y=None,height=60)
        box=BoxLayout(orientation="vertical"); box.add_widget(chooser); box.add_widget(select)
        p=Popup(title="Choose a Photo",content=box,size_hint=(.95,.95))
        def choose(*x):
            if chooser.selection: task["photo"]=chooser.selection[0]; self.save_tasks(); self.show_tasks()
            p.dismiss()
        select.bind(on_press=choose); p.open()

    def show_tasks(self):
        if not hasattr(self,"task_list"): return
        self.task_list.clear_widgets(); total=len(self.tasks); done=sum(t.get("completed",False) for t in self.tasks)
        self.counter.text=f"[color=00aaff]Total: {total}[/color]    [color=00ff88]Done: {done}[/color]"
        search=self.search_input.text.lower()
        for task in self.tasks:
            if search not in task.get("text","").lower(): continue
            if self.current_filter=="ACTIVE" and task.get("completed"): continue
            if self.current_filter=="DONE" and not task.get("completed"): continue
            card=RoundedBox(orientation="vertical",size_hint_y=None,height=150,spacing=5,padding=8)
            top=BoxLayout(spacing=8); photo=task.get("photo","")
            if photo and os.path.exists(photo): top.add_widget(Image(source=photo,size_hint_x=.25))
            prefix="DONE - " if task.get("completed") else "• "
            top.add_widget(Label(text=prefix+task.get("text",""),font_size=16))
            row=BoxLayout(size_hint_y=None,height=55,spacing=5)
            for text,fn in [("EDIT",self.edit_task),("PHOTO",self.photo_clicked),("UNDO" if task.get("completed") else "DONE",self.toggle_done),("DELETE",self.delete_task)]:
                b=Button(text=text); b.bind(on_press=lambda x,f=fn,t=task:f(t)); row.add_widget(b)
            card.add_widget(top); card.add_widget(row); self.task_list.add_widget(card)

    # ---------------- STOPWATCH ----------------
    def format_time(self):
        h=self.stopwatch_seconds//3600; m=(self.stopwatch_seconds%3600)//60; s=self.stopwatch_seconds%60
        return f"{h:02d}:{m:02d}:{s:02d}"
    def open_stopwatch(self,*args):
        self.sw_label=Label(text=self.format_time(),font_size=40)
        box=BoxLayout(orientation="vertical",padding=15,spacing=15); row=BoxLayout(size_hint_y=None,height=60)
        for text,fn in [("START",self.start_sw),("STOP",self.stop_sw),("RESET",self.reset_sw)]:
            b=Button(text=text); b.bind(on_press=fn); row.add_widget(b)
        box.add_widget(self.sw_label); box.add_widget(row); Popup(title="⏱ STOPWATCH",content=box,size_hint=(.9,.5)).open()
    def start_sw(self,*args):
        if not self.stopwatch_event: self.stopwatch_event=Clock.schedule_interval(self.tick,1)
    def tick(self,dt):
        self.stopwatch_seconds+=1
        if hasattr(self,"sw_label"): self.sw_label.text=self.format_time()
    def stop_sw(self,*args):
        if self.stopwatch_event: self.stopwatch_event.cancel(); self.stopwatch_event=None
    def reset_sw(self,*args):
        self.stop_sw(); self.stopwatch_seconds=0
        if hasattr(self,"sw_label"): self.sw_label.text=self.format_time()

    # ---------------- PER USER STORAGE ----------------
    def filename(self):
        return "tasks_"+self.current_user.get("uid","guest")+".json" if self.current_user else "tasks_guest.json"
    def save_tasks(self):
        try:
            with open(self.filename(),"w",encoding="utf-8") as f: json.dump(self.tasks,f,ensure_ascii=False)
        except Exception: pass
    def load_tasks(self):
        try:
            if os.path.exists(self.filename()):
                with open(self.filename(),"r",encoding="utf-8") as f: data=json.load(f)
                return [x if isinstance(x,dict) else {"text":x,"completed":False,"photo":""} for x in data]
        except Exception: pass
        return []

if __name__ == "__main__":
    TodoApp().run(
