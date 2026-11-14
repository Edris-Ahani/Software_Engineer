use std::{cell::RefCell, rc::{Rc, Weak}};

#[derive(Debug)]
struct Node {
    name: String,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let root = Rc::new(Node {
        name: String::from("root"), parent: RefCell::new(Weak::new()),
        children: RefCell::new(Vec::new()),
    });
    let child = Rc::new(Node {
        name: String::from("child"), parent: RefCell::new(Rc::downgrade(&root)),
        children: RefCell::new(Vec::new()),
    });
    root.children.borrow_mut().push(Rc::clone(&child));
    println!("{} -> {}", root.name, child.name);
    assert!(child.parent.borrow().upgrade().is_some());
    drop(root);
    assert!(child.parent.borrow().upgrade().is_none());
    let boxed = Box::new([0_u8; 16]);
    assert_eq!(boxed.len(), 16);
}
