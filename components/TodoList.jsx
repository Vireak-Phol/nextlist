import {
  Box,
  Input,
  Button,
  Textarea,
  Stack,
  Select,
  Badge,
  Heading,
  SimpleGrid,
  Text,
  useToast, 
  FormControl,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { collection, connectFirestoreEmulator, onSnapshot, query, where} from "firebase/firestore";
import { db } from "../firebase";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import {addTodo, updateTodo, deleteTodo, toggleTodoStatus } from "../api/todo";
import moment from 'moment';

const TodoList = () => {
  const toast = useToast();
  // const { isLoggedIn, user } = useAuth();

  const [todos, setTodos] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState("false");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [search, setSearch] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState([]);


  const refreshData = () => {
    // if (!user) {
    //   setTodos([]);
    //   return;
    // }
    // const q = query(collection(db, "todo"), where("user", "==", user.uid));
    const q = query(collection(db, "todo"));


    onSnapshot(q, (querySnapchot) => {
      let ar = [];
      querySnapchot.docs.forEach((doc) => {
        ar.push({ id: doc.id, ...doc.data() });
      });

      const x = ar.sort((a, b) => {
        if(a.isCompleted == "true" && b.isCompleted == "false") return 1; 
        if(b.isCompleted == "true" && a.isCompleted == "false") return -1;
        return a.createdAt - b.createdAt;
      });

      // Filter Data Here
      if(search.length){
        const searchFilter = (arr) => {
          return arr.filter( 
            (el) => el.title.toLowerCase().includes(search.toLowerCase())
          )
        }
        setResult(searchFilter(todos));
        result.map((res) => {
          if(res.title === search){
            setIsActive(false);
            setTodos(result);
          }else{
            setIsActive(true);
          }
        })
      }else{
        setTodos(x);
        setResult([]);
        setIsActive(false);
      }
      
    });

  };

  const clickTitle = (tl) => {
    setSearch(tl);
    setIsActive(false);
  }

  const handleTodoCreate = async () => {
    // if ( !isLoggedIn ) {
    //   toast({
    //     title: "You must be logged in to create a todo",
    //     status: "error",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    //   return;
    // }
    setIsLoading(true);
    const todo = {
      title,
      description,
      isCompleted,
      // userId: user.uid,
    };

    await addTodo(todo);
    setIsLoading(false);

    setTitle("");
    setDescription("");
    setIsCompleted("false");

    toast({ title: "Todo created successfully", status: "success" });
  };
  
  
  useEffect(() => {
    refreshData();

    // Check duplicate data
    if(title.length){
      const checkTitle = (arr) => {
        return arr.filter( 
          // (el) => el.title.toLocaleLowerCase().startsWith(title.toLocaleLowerCase())
          (el) => el.title.toLocaleLowerCase().match(title.toLocaleLowerCase())
        )
      }
      if(checkTitle(todos).length && !isUpdate){
        setIsDuplicate(true);
        setIsLoading(true);
      }else{
        setIsDuplicate(false);
        setIsLoading(false);
      }
    }else{
      setIsDuplicate(false)
      setIsLoading(false);
    }
  }, [search, title]);
  

  const handleTodoDelete = async (id) => {
    if (confirm("Are you sure you wanna delete this todo?")) {
      deleteTodo(id);
      toast({ title: "Todo deleted successfully", status: "success" });
    }
  };

  const handleTodoUpdate = async (id, title, description, isCompleted) => {
    setUpdateId(id);
    setIsUpdate(true);
    setTitle(title);
    setDescription(description);
    setIsCompleted(isCompleted);
  };

  const rForm = () => {
    setIsUpdate(false);
    setTitle("");
    setDescription("");
    setIsCompleted("false");
  }
  // When Click Confirm
  const bConfirm = async () => {
    console.log(updateId);
    const dataUpdate = {
      docId:updateId,
      title,
      description,
      isCompleted,
      // userId: user.uid,
    }
    await updateTodo(dataUpdate);
    setIsDuplicate(false);
    setIsUpdate(false);
    setIsLoading(false);
    setTitle("");
    setDescription("");
    setIsCompleted("false");
    toast({ title: "Todo update successfully", status: "success" });
    console.log(isDuplicate);
  }

  const handleToggle = async (id, isCompleted) => {
    const newStatus = isCompleted == "true" ? "false" : "true";
    await toggleTodoStatus({ docId: id, isCompleted: newStatus });
    toast({
      title: `Todo marked ${newStatus == "true" ? "Completed" : "Pending"}`,
      isCompleted: newStatus == "completed" ? "success" : "warning",
    })
  }

  return (
      <Box w={{base: '100%', md: '40%'}} margin={"0 auto"}>

        <SimpleGrid mt={5}>
          <Stack direction="column">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="text-danger">
              { isDuplicate ? "This title is already exist in todo list" : "" }
            </div>

            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Select value={isCompleted} onChange={(e) => setIsCompleted(e.target.value)}>
              <option
                value={false}
                style={{ color: "yellow", fontWeight: "bold" }}
              >
                Pending ⌛
              </option>
              <option
                value={true}
                style={{ color: "green", fontWeight: "bold" }}
              >
                Completed ✅
              </option>
            </Select>

            { isUpdate == false && <Button
              onClick={() => handleTodoCreate()}
              disabled={title.length < 1 ||  description.length < 1 || isLoading}
              variantcolor="teal"
              variant="solid"
            >
              Add
            </Button> }
            <SimpleGrid display={"flex"} justifyContent={"space-between"}>
              { isUpdate == true && 
                <Button
                  onClick={() => rForm()}
                  variantcolor="teal"
                  width="38%"
                  variant="solid">
                  Cancel
                </Button>}
              { isUpdate == true && 
                <Button
                  onClick={() => bConfirm()}
                  disabled={title.length < 1 || description.length < 1 || isLoading}
                  width="58%"
                  variantcolor="teal"
                  variant="solid"
                >
                  Confirm
                </Button>}
            </SimpleGrid>
          </Stack>
        </SimpleGrid>


        {/* End Create  */}
          
        <SimpleGrid mt={5} columns={{ base: 1 }} spacing={8}>
          <form className="wrapper">
            <FormControl>
              <Input type='text' placeholder="Search" value={search}  onChange={(e) => setSearch(e.target.value)} />
              
              <div className={ isActive ? "autocom-box show" : "hide"}>
                {
                  result.length ? (
                    result.map((res, index) => (
                      <li key={index} onClick={() => clickTitle(res.title)}>{ res.title }</li>
                    ))
                  ) : (
                    isActive && (
                      <li>"{ search }" No result match</li> 
                    )
                  )
                }
              </div>

            </FormControl>
          </form>
          { todos.length ? (

            todos.map((todo) => (
              <Box
                key={todo.id}
                p={3}
                boxShadow="2xl"
                shadow={"dark-lg"}
                transition="0.2s"
                borderRadius={8}
                _hover={{ boxShadow: "sm" }}
              >
                <Heading as="h3" fontSize={"xl"}> 
                  <div className="text-gray">{todo.title}{" "}</div>
                  <div className="wrap-badge">
                    <Badge
                      color="red.500"
                      bg="inherit"
                      transition={"0.2s"}
                      _hover={{
                        bg: "inherit",
                        transform: "scale(1.2)",
                      }}
                      float="right"
                      size="xs"
                      onClick={() => handleTodoDelete(todo.id)}
                    >
                      <FaTrash />
                    </Badge>
                    <Badge
                      color="red.500"
                      bg="inherit"
                      transition={"0.2s"}
                      _hover={{
                        bg: "inherit",
                        transform: "scale(1.2)",
                      }}
                      float="right"
                      size="xs"
                      onClick={() => handleTodoUpdate(todo.id, todo.title, todo.description, todo.isCompleted)}
                    >
                      <FaEdit />
                    </Badge>
                    <Badge
                      color={todo.isCompleted === "false" ? "gray.500" : "green.500"}
                      bg="inherit"
                      transition={"0.2s"}
                      _hover={{
                        bg: "inherit",
                        transform: "scale(1.2)",
                      }}
                      float="right"
                      size="xs"
                      onClick={() => handleToggle(todo.id, todo.isCompleted)}
                    >
                      {todo.isCompleted === "false" ? <FaToggleOff /> : <FaToggleOn />}
                    </Badge>
                    <Badge
                      float="right"
                      opacity="0.8"
                      bg={todo.isCompleted === "false" ? "yellow.500" : "green.500"}
                    >
                      {todo.isCompleted === "true" ? "Completed" : "Pending" }
                    </Badge>
                  </div>
                </Heading>
                  { todo.updatedAt ? (
                  <Text className="text-pink">{ moment( new Date(todo.updatedAt), "YYYYMMDD").fromNow() }</Text>
                  ) : (
                    <Text className="text-pink">{ moment( new Date(todo.createdAt), "YYYYMMDD").fromNow() }</Text>
                  ) }
                  <hr />
                <Text>{todo.description}</Text>
              </Box>
            ))) : ( <div className="">No result, Create new one instead</div> )
          }
        </SimpleGrid>

      </Box>
  );
};

export default TodoList;
