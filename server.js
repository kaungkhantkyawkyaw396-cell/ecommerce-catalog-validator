const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function validateItem(item) {
  const errors = [];

  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return ["Request body must be a JSON object."];
  }

  // SKU must contain 3-20 uppercase letters, numbers, or hyphens.
  if (typeof item.sku !== "string" || !/^[A-Z0-9-]{3,20}$/.test(item.sku)) {
    errors.push("sku must be 3-20 characters using uppercase letters, numbers, or hyphens.");
  }

  if (typeof item.price !== "number" || !Number.isFinite(item.price) || item.price <= 0) {
    errors.push("price must be a number greater than 0.");
  }

  if (!Array.isArray(item.tags) || item.tags.length < 1) {
    errors.push("tags must be an array containing at least one tag.");
  } else {
    const normalizedTags = item.tags.map(tag =>
      typeof tag === "string" ? tag.trim().toLowerCase() : tag
    );

    if (normalizedTags.some(tag => typeof tag !== "string" || tag.length === 0)) {
      errors.push("every tag must be a non-empty string.");
    }

    if (new Set(normalizedTags).size !== normalizedTags.length) {
      errors.push("tags must be unique.");
    }
  }

  if (!item.vendor || typeof item.vendor !== "object" || Array.isArray(item.vendor)) {
    errors.push("vendor must be an object containing name and email.");
  } else {
    if (typeof item.vendor.name !== "string" || item.vendor.name.trim() === "") {
      errors.push("vendor.name is required.");
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof item.vendor.email !== "string" || !emailPattern.test(item.vendor.email)) {
      errors.push("vendor.email must be a valid email address.");
    }
  }

  return errors;
}

app.post("/api/catalog/items", (req, res) => {
  const errors = validateItem(req.body);

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: "Catalog item validation failed.",
      errors
    });
  }

  return res.status(201).json({
    success: true,
    message: "Catalog item created successfully.",
    item: req.body
  });
});

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", service: "catalog-validator" });
});

// Return JSON for malformed JSON request bodies.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body."
    });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Catalog Validator API is running at http://localhost:${PORT}`);
});
