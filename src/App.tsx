import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import "./App.css";
import { nanoid } from "nanoid";
import { FaTrash,FaPenSquare } from "react-icons/fa";
import { Modal } from "react-bootstrap";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;
const InputDiv = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 3rem 0;
`;
const InputEl = styled.input`
  min-width: 300px;
  border-radius: 1rem;
  border: 1px solid black;
  padding-left: 1rem;
`;
const Button = styled.button`
  color: white;
  background-color: rgb(22, 84, 141);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid black;
  cursor: pointer;
`;
const ListItemEl = styled.li`
  display:flex;
  align-items: center;
  list-style: none;
  border: 1px solid black;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  width: 500px;
  margin-bottom: 1rem;
  background-color: #d6d6cd;
  justify-content:space-between;
`;
const ButtonContainer = styled.div`
display:flex;
gap: 1rem;
`
const ButtonInput = styled.button`
display:flex;
justify-content:center;
align-items:center;
background-color: #2f3e6e;
color: #fff;
font-size: 1rem;
padding: .5rem;
border: 1px solid black;
`

interface ListItem {
  id: string;
  content: string;
}

function App() {
  const [inputVal, setInputVal] = useState<string>("");
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [modalInputValue,setModalInputValue] = useState<string>("")
  const [modalIsOpen,setModalIsOpen] = useState<boolean>(false);
  const [selectedId,setSelectedId] = useState<string>("")


  const addTodo = () => {
    if (inputVal.trim() === "") return;
    
    const newList = {
      id: nanoid().slice(0,5),
      content: inputVal,
    };
    setListItems([...listItems, newList]);
    setInputVal("");
  };

  const deleteTodo = (id:string) => {
    const newList = listItems.filter((item) =>  item.id !== id)
    setListItems(newList)
  }

const handleClose = () => {
  setModalIsOpen(false)
}
const handleShow =(id:string,content: string) => {
  setModalIsOpen(true)
  setSelectedId(id)
  setModalInputValue(content)
}

const handleEdit = () => {
  const selectedItem = listItems.find((item) => item.id === selectedId)
  console.log(selectedItem)
  if(selectedItem){
    selectedItem.content = modalInputValue
  }
  setModalIsOpen(false)
}
  

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    console.log(result);
    const items = [...listItems];
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    setListItems(items);
  };

  return (
    <>
      <Wrapper>
        <h1>To-Do List</h1>
        <InputDiv>
          <InputEl
            type="text"
            onChange={(e) => setInputVal(e.target.value)}
            value={inputVal}
            placeholder="todo..."
          />
          <Button onClick={addTodo}>ADD</Button>
        </InputDiv>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {listItems.map(({ id, content }: ListItem, index: number) => (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <ListItemEl
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {content}
                        <ButtonContainer>
                          <ButtonInput onClick={() => handleShow(id,content)}  ><FaPenSquare /></ButtonInput>
                          <ButtonInput onClick={() => deleteTodo(id)}><FaTrash /></ButtonInput>
                        </ButtonContainer>
                      </ListItemEl>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Modal show={modalIsOpen} onHide={handleClose}> 
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body><InputEl value={modalInputValue} onChange={(e) => setModalInputValue(e.target.value)} /></Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} >
            Close
          </Button>
          <Button onClick={handleEdit}  >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </Wrapper>
    </>
  );
}

export default App;
