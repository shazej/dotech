import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/payment_bloc.dart';

class PaymentPage extends StatelessWidget {
  final double amount;

  const PaymentPage({super.key, required this.amount});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          PaymentBloc()
            ..add(CreatePaymentIntentEvent(amount: amount, currency: 'usd')),
      child: Scaffold(
        appBar: AppBar(title: const Text('Checkout')),
        body: BlocConsumer<PaymentBloc, PaymentState>(
          listener: (context, state) {
            if (state is PaymentSuccess) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Payment Successful!')),
              );
              // In real app, we would trigger the BookingBloc here to finalize booking with payment ID
              Navigator.pop(context, true); // Return success
            } else if (state is PaymentFailure) {
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(SnackBar(content: Text(state.message)));
            }
          },
          builder: (context, state) {
            if (state is PaymentLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is PaymentIntentCreated) {
              return Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Text(
                      'Total to pay: \$${amount.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 40),
                    const TextField(
                      decoration: InputDecoration(
                        labelText: 'Card Number',
                        border: OutlineInputBorder(),
                        hintText: '4242 4242 4242 4242',
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Row(
                      children: [
                        Expanded(
                          child: TextField(
                            decoration: InputDecoration(
                              labelText: 'Expiry',
                              border: OutlineInputBorder(),
                              hintText: 'MM/YY',
                            ),
                          ),
                        ),
                        SizedBox(width: 20),
                        Expanded(
                          child: TextField(
                            decoration: InputDecoration(
                              labelText: 'CVC',
                              border: OutlineInputBorder(),
                              hintText: '123',
                            ),
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    ElevatedButton(
                      onPressed: () {
                        context.read<PaymentBloc>().add(
                          ConfirmPaymentEvent(state.clientSecret),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 50),
                      ),
                      child: const Text('Pay Now'),
                    ),
                  ],
                ),
              );
            }
            return const Center(child: Text('Initializing Payment...'));
          },
        ),
      ),
    );
  }
}
