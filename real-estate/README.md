# React + Vite

app.use(express.json());
app.use(cookieParser);
app.use("/api/user" ,userRoutes);
app.use("/api/auth",authRoutes);
app.use(".api/listing", listingRouter);

#all the links to the API routes
