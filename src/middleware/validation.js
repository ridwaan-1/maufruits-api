/* A middleware function that validates the inputs of the user. */
exports.validateInputs = (req, res, next) => {
    const { email, password } = req.body;
    if (!(email.match(/[@]/) && email.match(/[.]/))) 
        return res.status(404).json({ message: `Invalid email` });
    
    if (password.length < 6) 
        return res.status(404).json({ message: `Your password must be at least 6 characters long. Please try another.` });

    next();
}

exports.validateShippingForm = (req, res, next) => {
    const { address, deliveryOption, paymentOption } = req.body;
   
    if (!deliveryOption) 
        return res.status(404).json({ 
            shippingFormError: {
                errorField: 'delivery', 
                message: 'Please choose a delivery method' 
            }
        });
    if(!address) {
        if(deliveryOption==='delivery' || !deliveryOption) {
            return res.status(404).json({ 
                shippingFormError: {
                    errorField: 'delivery', 
                    message: 'Please select an address for delivery' 
                }
            });
        }
    }

    if(!paymentOption) 
        return res.status(404).json({ 
            shippingFormError: {
                errorField: 'payment', 
                message: 'Please select a payment method' 
            }
        });

    next();
}