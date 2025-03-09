    const asyncHandler = require("express-async-handler")
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    const Student = require("../Models/studentModel")

    // @desc Register a Student
    // @route POST /api/student/register
    // @access public
    const registerStudent = asyncHandler(async (req, res) => {

        const { name , email, password , matric_number ,level , department } = req.body;
    
        if (!name || !email || !password ||  !matric_number
        || !level   || !department){
        res.status(400);
        throw new Error("All fields are mandatory!");
        }
    
        const userAvailable = await Student.findOne({ email });
    
        if (userAvailable) {
        res.status(400);
        throw new Error("Student already registered!");
        }
    
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);
    
        const student = await Student.create({
        name ,
        email,
        password: hashedPassword,
        matric_number ,
        level ,
        department
        });
    
        console.log(`User created: ${student}`);
    
        if (student) {
        res.status(201).json({
            _id: student.id,
            name: student.name,
            email: student.email,
            matric_number : student.matric_number ,
            level : student.level,
            department : student.department
        });
    
        } 
        
        else {
        res.status(400);
        throw new Error("Student data is invalid");
        }
    });
    


    // @desc Login Student
    // @route POST /api/student/login
    // @access Public

    const loginStudent = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
      
        if (!email || !password) {
          res.status(400);
          throw new Error("All fields are mandatory!");
        }
      
        const student = await Student.findOne({ email });
      
        // Compare password with hashed password
        if (student && (await bcrypt.compare(password, student.password))) { // Fixed `user.password`
          const accessToken = jwt.sign(
            {
              student: {
                name: student.name,
                email: student.email,
                matric_number: student.matric_number ,
                level: student.level ,
                department : student.department ,
                id: student.id
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "40m" }
          );
      
          if(student){
              res.status(200).json({
            name: student.name,
            email: student.email,
            matric_number: student.matric_number ,
            level: student.level ,
            department : student.department ,
            accessToken 
          });
        
        } 

        else{
            res.status(404);
            throw new Error("User not found");
        }
    }

        else {
          res.status(401);
          throw new Error("Email or password is not valid");
        }
      });



    // @desc Get Current Student info
    // @route GET /api/student/current
    // @access Private
    const currentStudent = asyncHandler(async (req, res) => {

    const student = await Student.findById(req.student.id).select("-password"); // Exclude password

    if (student) {
        res.status(200).json({
            name : student.name ,
            email: student.email,
            matric_number : student.matric_number ,
            department : student.department ,
            level : student.level

            
        });

        } else {
        res.status(404);
        throw new Error("Student not found");
    }

    });



    //@desc Get all students
    // @route GET /api/Students
    // @access private

    const getStudents = asyncHandler(async (req, res) => {
        // Ensure the request is from a lecturer
        if (!req.user ) {
            res.status(403);
            throw new Error("Access denied. Only lecturers can view students.");
        }
    
        const students = await Student.find(); // Fetch all students
        res.status(200).json(students);
    });
    


    //@desc Create new student
    // @route POST /api/Students
    // @access private

    const createStudent = asyncHandler( async (req , res ) =>{

        console.log("Console output" , req.body)

        const{name , email , matric_number} = req.body

        if(!name || !email || !matric_number)
            {
            res.status(400)
            throw new Error("All fields must be filled")  
        }

        const student = await Student.create({
            name ,
            email ,
            matric_number ,
            user_id: req.user.id
        })

        res.status(201).json(student)
    })

    //@desc Get Student
    // @route GET /api/Students/:id
    // @access private

    const getStudent = asyncHandler( async (req , res ) =>{
        
            const student = await Student.findById(req.params.id)

            if(!student){
                res.status(404)
                throw new Error("Student not found")
            }



        res.status(200).json(student)
    })

    //@desc Update student
    // @route PUT /api/Contacts/:id
    // @access private

    const updateStudent = asyncHandler( async (req , res ) =>{

        const student = await Student.findById(req.params.id)

        if(!student){
            res.status(404)
            throw new Error("Student not found")
        }

        if(student.user_id.toString() !== req.user.id){
            res.status(403)

            throw new Error("User doesn't have permission to update other user's Students")
        }
            const updatedStudent = await Student.findByIdAndUpdate(
                req.params.id , 
                req.body ,
                {new: true}
            )



        
        res.status(200).json(updatedStudent)
    })

    //@desc Delete contact
    // @route DELETE /api/Contacts/:id
    // @access public

    const deleteStudent = asyncHandler( async (req , res ) =>{

        const student = await Student.findById(req.params.id)

        if (!student) {
            res.status(404)
            throw new Error("Student not found")
        }

        if(student.user_id.toString() !== req.user.id){
            res.status(403)

            throw new Error("User doesn't have permission to delete other user's Students")
        }

        await student.deleteOne({_id: req.params.id}) // Corrected delete operation 
        
        res.status(200).json({ message: "Student deleted successfully" })
    })

    module.exports = {registerStudent , loginStudent , currentStudent , getStudents , createStudent , getStudent , updateStudent , deleteStudent}