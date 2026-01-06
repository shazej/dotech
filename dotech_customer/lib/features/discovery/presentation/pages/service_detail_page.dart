import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dotech_customer/features/discovery/domain/entities/service.dart';
import 'package:dotech_customer/features/booking/presentation/bloc/booking_bloc.dart';
import 'package:dotech_customer/features/booking/presentation/pages/payment_page.dart';

class ServiceDetailPage extends StatelessWidget {
  final Service service;
  const ServiceDetailPage({super.key, required this.service});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(service.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.indigo[50],
                borderRadius: BorderRadius.circular(15),
              ),
              child: const Icon(Icons.image, size: 80, color: Colors.indigo),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  service.name,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '\$${service.basePrice}',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Pricing: ${service.pricingModel.toUpperCase()}',
              style: TextStyle(color: Colors.grey[600], fontSize: 16),
            ),
            const SizedBox(height: 24),
            const Text(
              'Description',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              service.description.isNotEmpty
                  ? service.description
                  : 'No description provided for this service.',
              style: const TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 40),
            BlocConsumer<BookingBloc, BookingState>(
              listener: (context, state) {
                if (state is BookingPlaced) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Booking request sent!')),
                  );
                  Navigator.pop(context);
                } else if (state is BookingError) {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(SnackBar(content: Text(state.message)));
                }
              },
              builder: (context, state) {
                return ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    // Retained original style
                    minimumSize: const Size(double.infinity, 55),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: state is BookingLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Book Now', style: TextStyle(fontSize: 18)),
                  onPressed: () async {
                    final success = await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => PaymentPage(amount: service.basePrice),
                      ),
                    );

                    if (success == true) {
                      if (context.mounted) {
                        context.read<BookingBloc>().add(
                          PlaceBookingEvent(
                            serviceId: service.id,
                            scheduledAt: DateTime.now().add(
                              const Duration(days: 1),
                            ),
                            addressId: 'temp-address-id',
                          ),
                        );
                      }
                    }
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
