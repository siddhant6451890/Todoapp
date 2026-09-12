import json
import os

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.filechooser import FileChooserListView
from kivy.uix.popup import Popup
from kivy.uix.image import Image
from kivy.graphics import Color, RoundedRectangle


class RoundedBox(BoxLayout):

    def __init__(self, bg_color, **kwargs):
        super().__init__(**kwargs)

        with self.canvas.before:
            self.bg = Color(*bg_color)

            self.rect = RoundedRectangle(
                pos=self.pos,
                size=self.size,
                radius=[15]
            )

        self.bind(pos=self.update_rect)
        self.bind(size=self.update_rect)

    def update_rect(self, *args):
        self.rect.pos = self.pos
        self.rect.size = self.size


class TodoApp(App):

    def build(self):

        self.tasks = self.load_tasks()
        self.current_filter = "ALL"

        layout = BoxLayout(
            orientation="vertical",
            padding=15,
            spacing=10
        )

        title = Label(
            text="[b][color=00aaff]MY TO-DO APP[/color][/b]",
            markup=True,
            font_size=28,
            size_hint_y=None,
            height=65
        )

        self.counter = Label(
            text="",
            markup=True,
            font_size=16,
            size_hint_y=None,
            height=35
        )

        self.search_input = TextInput(
            hint_text="Search tasks...",
            multiline=False,
            size_hint_y=None,
            height=50
        )

        self.search_input.bind(
            text=lambda instance, value: self.show_tasks()
        )

        self.task_input = TextInput(
            hint_text="Enter new task...",
            multiline=False,
            size_hint_y=None,
            height=55
        )

        add_button = Button(
            text="ADD TASK",
            size_hint_y=None,
            height=55,
            background_color=(0.1, 0.8, 0.4, 1)
        )

        add_button.bind(on_press=self.add_task)

        # FILTERS

        filter_layout = BoxLayout(
            size_hint_y=None,
            height=50,
            spacing=5
        )

        all_button = Button(text="ALL")
        active_button = Button(text="ACTIVE")
        completed_button = Button(text="DONE")

        all_button.bind(
            on_press=lambda button:
            self.set_filter("ALL")
        )

        active_button.bind(
            on_press=lambda button:
            self.set_filter("ACTIVE")
        )

        completed_button.bind(
            on_press=lambda button:
            self.set_filter("DONE")
        )

        filter_layout.add_widget(all_button)
        filter_layout.add_widget(active_button)
        filter_layout.add_widget(completed_button)

        # TASK LIST

        self.task_list = BoxLayout(
            orientation="vertical",
            size_hint_y=None,
            spacing=8
        )

        self.task_list.bind(
            minimum_height=self.task_list.setter("height")
        )

        scroll = ScrollView()
        scroll.add_widget(self.task_list)

        layout.add_widget(title)
        layout.add_widget(self.counter)
        layout.add_widget(self.search_input)
        layout.add_widget(self.task_input)
        layout.add_widget(add_button)
        layout.add_widget(filter_layout)
        layout.add_widget(scroll)

        self.show_tasks()

        return layout


    def set_filter(self, filter_name):

        self.current_filter = filter_name
        self.show_tasks()


    def add_task(self, button):

        task_text = self.task_input.text.strip()

        if task_text:

            self.tasks.append({
                "text": task_text,
                "completed": False,
                "photo": ""
            })

            self.task_input.text = ""

            self.save_tasks()
            self.show_tasks()


    def toggle_done(self, task):

        task["completed"] = not task.get(
            "completed",
            False
        )

        self.save_tasks()
        self.show_tasks()


    def delete_task(self, task):

        self.tasks.remove(task)

        self.save_tasks()
        self.show_tasks()


    # =========================
    # EDIT TASK
    # =========================

    def edit_task(self, task):

        edit_input = TextInput(
            text=task.get("text", ""),
            multiline=False,
            size_hint_y=None,
            height=60
        )

        save_button = Button(
            text="SAVE",
            background_color=(0.2, 0.7, 0.4, 1)
        )

        cancel_button = Button(
            text="CANCEL",
            background_color=(0.8, 0.3, 0.3, 1)
        )

        button_box = BoxLayout(
            size_hint_y=None,
            height=55,
            spacing=5
        )

        button_box.add_widget(save_button)
        button_box.add_widget(cancel_button)

        box = BoxLayout(
            orientation="vertical",
            spacing=10,
            padding=10
        )

        box.add_widget(edit_input)
        box.add_widget(button_box)

        popup = Popup(
            title="EDIT TASK",
            content=box,
            size_hint=(0.9, 0.4)
        )


        def save_edit(button):

            new_text = edit_input.text.strip()

            if new_text:

                task["text"] = new_text

                self.save_tasks()
                self.show_tasks()

                popup.dismiss()


        save_button.bind(
            on_press=save_edit
        )

        cancel_button.bind(
            on_press=lambda button:
            popup.dismiss()
        )

        popup.open()


    # =========================
    # PHOTO PICKER
    # =========================

    def photo_clicked(self, task):

        chooser = FileChooserListView(
            filters=[
                "*.jpg",
                "*.jpeg",
                "*.png"
            ]
        )

        select_button = Button(
            text="SELECT PHOTO",
            size_hint_y=None,
            height=60,
            background_color=(0.2, 0.7, 0.4, 1)
        )

        box = BoxLayout(
            orientation="vertical",
            spacing=5,
            padding=5
        )

        box.add_widget(chooser)
        box.add_widget(select_button)

        popup = Popup(
            title="Choose a Photo",
            content=box,
            size_hint=(0.95, 0.95)
        )


        def select_photo(button):

            if chooser.selection:

                task["photo"] = chooser.selection[0]

                self.save_tasks()

                popup.dismiss()

                self.show_tasks()


        select_button.bind(
            on_press=select_photo
        )

        popup.open()


    def show_tasks(self):

        self.task_list.clear_widgets()

        total = len(self.tasks)

        completed = sum(
            1 for task in self.tasks
            if task.get("completed", False)
        )

        self.counter.text = (
            f"[color=00aaff]Total: {total}[/color]    "
            f"[color=00ff88]Done: {completed}[/color]"
        )

        search_text = self.search_input.text.lower()


        for task in self.tasks:

            # Fix old saved tasks

            if "photo" not in task:
                task["photo"] = ""


            # SEARCH

            if search_text not in task.get(
                "text",
                ""
            ).lower():
                continue


            # FILTERS

            if (
                self.current_filter == "ACTIVE"
                and task.get("completed", False)
            ):
                continue


            if (
                self.current_filter == "DONE"
                and not task.get("completed", False)
            ):
                continue


            # TASK CARD

            task_card = RoundedBox(
                bg_color=(0.15, 0.15, 0.22, 1),
                orientation="vertical",
                size_hint_y=None,
                height=150,
                spacing=5,
                padding=8
            )


            # TOP ROW

            top_row = BoxLayout(
                spacing=8
            )


            # PHOTO

            photo_path = task.get("photo", "")

            if (
                photo_path
                and os.path.exists(photo_path)
            ):

                image = Image(
                    source=photo_path,
                    size_hint_x=0.25,
                    allow_stretch=True
                )

                top_row.add_widget(image)


            # TASK TEXT

            if task.get("completed", False):

                text = (
                    "[color=888888]"
                    "DONE - "
                    + task.get("text", "")
                    + "[/color]"
                )

                done_text = "UNDO"

            else:

                text = (
                    "[color=00ff88]• "
                    + task.get("text", "")
                    + "[/color]"
                )

                done_text = "DONE"


            task_label = Label(
                text=text,
                markup=True,
                font_size=16
            )

            top_row.add_widget(task_label)


            # BUTTON ROW

            button_row = BoxLayout(
                size_hint_y=None,
                height=55,
                spacing=5
            )


            # EDIT BUTTON

            edit_button = Button(
                text="EDIT",
                background_color=(1, 0.6, 0.1, 1)
            )


            # PHOTO BUTTON

            photo_button = Button(
                text="PHOTO",
                background_color=(0.6, 0.3, 0.8, 1)
            )


            # DONE BUTTON

            done_button = Button(
                text=done_text,
                background_color=(0.2, 0.5, 1, 1)
            )


            # DELETE BUTTON

            delete_button = Button(
                text="DELETE",
                background_color=(1, 0.2, 0.2, 1)
            )


            # =====================
            # BUTTON ACTIONS
            # =====================

            edit_button.bind(
                on_press=lambda button, t=task:
                self.edit_task(t)
            )

            photo_button.bind(
                on_press=lambda button, t=task:
                self.photo_clicked(t)
            )

            done_button.bind(
                on_press=lambda button, t=task:
                self.toggle_done(t)
            )

            delete_button.bind(
                on_press=lambda button, t=task:
                self.delete_task(t)
            )


            # ADD BUTTONS

            button_row.add_widget(edit_button)
            button_row.add_widget(photo_button)
            button_row.add_widget(done_button)
            button_row.add_widget(delete_button)


            # ADD TO CARD

            task_card.add_widget(top_row)
            task_card.add_widget(button_row)

            self.task_list.add_widget(task_card)


    def save_tasks(self):

        with open(
            "tasks.json",
            "w"
        ) as file:

            json.dump(
                self.tasks,
                file
            )


    def load_tasks(self):

        if os.path.exists("tasks.json"):

            try:

                with open(
                    "tasks.json",
                    "r"
                ) as file:

                    data = json.load(file)


                fixed_tasks = []


                for task in data:

                    if isinstance(task, str):

                        fixed_tasks.append({
                            "text": task,
                            "completed": False,
                            "photo": ""
                        })


                    elif isinstance(task, dict):

                        fixed_tasks.append({
                            "text": task.get(
                                "text",
                                ""
                            ),

                            "completed": task.get(
                                "completed",
                                False
                            ),

                            "photo": task.get(
                                "photo",
                                ""
                            )
                        })


                return fixed_tasks


            except:

                return []


        return []


TodoApp().run()
